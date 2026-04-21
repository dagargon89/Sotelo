<?php

namespace App\Libraries;

class BoletaProcessor
{
    /** @var array<string, float> */
    private array $unitYields;
    private RouteResolver $routeResolver;
    private PacificoDetector $pacificoDetector;

    /** @param array<string, float> $unitYields */
    public function __construct(array $unitYields, RouteResolver $routeResolver, PacificoDetector $pacificoDetector)
    {
        $this->unitYields = $unitYields;
        $this->routeResolver = $routeResolver;
        $this->pacificoDetector = $pacificoDetector;
    }

    /** @param array<int, array<string, string>> $rows */
    public function processByBoleta(array $rows, string $driverName): array
    {
        $byBoleta = [];
        foreach ($rows as $row) {
            $boleta = trim((string) ($row['Boleta'] ?? ''));
            if ($boleta === '') {
                $boleta = 'SIN_BOLETA';
            }
            $byBoleta[$boleta][] = $row;
        }

        $entries = [];

        foreach ($byBoleta as $boleta => $boletaRows) {
            usort($boletaRows, function ($a, $b): int {
                $ta = $this->parseTs((string) ($a['Arranque'] ?? ''));
                $tb = $this->parseTs((string) ($b['Arranque'] ?? ''));
                return ($ta ?? 0) <=> ($tb ?? 0);
            });

            $firstRow = $boletaRows[0];
            $unit = trim((string) ($firstRow['Tractor'] ?? ''));
            $unitYield = (float) ($this->unitYields[$unit] ?? 2.37341);

            $isPac = false;
            foreach ($boletaRows as $row) {
                if ($this->pacificoDetector->isPacifico((string) ($row['Origen'] ?? ''))
                    || $this->pacificoDetector->isPacifico((string) ($row['Destino'] ?? ''))) {
                    $isPac = true;
                    break;
                }
            }

            $basePay = 0.0;
            $totalKmsRaw = 0.0;
            $totalKmsAdjusted = 0.0;
            $hasForaneo = false;
            $startTs = null;
            $endTs = null;
            $tableRows = [];

            foreach ($boletaRows as $row) {
                $origin = strtoupper(trim((string) ($row['Origen'] ?? '')));
                $dest = strtoupper(trim((string) ($row['Destino'] ?? '')));
                $status = strtoupper(trim((string) ($row['Estatus flete'] ?? '')));

                // D-001 (RULE_LEDGER): Solo statuses válidos avanzan a nómina.
                // FACTURADO = viaje cargado completado, COMPLETO/TERMINADO = viaje vacío/PT completado.
                // EN TRÁNSITO, CANCELADO y cualquier otro status se descartan.
                $validStatuses = ['FACTURADO', 'COMPLETO', 'TERMINADO'];
                if ($status !== '' && !in_array($status, $validStatuses, true)) {
                    continue;
                }
                $tipo = strtoupper(trim((string) ($row['Tipo'] ?? '')));
                $comments = strtoupper(trim((string) ($row['Comentarios'] ?? '')));

                $tsStart = $this->parseTs((string) ($row['Arranque'] ?? ''));
                $tsEnd = $this->parseTs((string) ($row['Arribo destino'] ?? ''));
                if ($tsStart && ($startTs === null || $tsStart < $startTs)) {
                    $startTs = $tsStart;
                }
                if ($tsEnd && ($endTs === null || $tsEnd > $endTs)) {
                    $endTs = $tsEnd;
                }

                $isLoaded = ($status === 'FACTURADO')
                    || in_array($tipo, ['IMP-01', 'IMP-02', 'EXP-01', 'EXP-02', 'FOR-01', 'FOR-02', 'MDC-01', 'MDC-02', 'TRI-01', 'TRI-02', 'TRE-01', 'TRE-02', 'LOC-01', 'LOC-02'], true);

                if (strpos($comments, 'VACIO') !== false || strpos($comments, 'VASIO') !== false || $status === 'COMPLETO'
                    || in_array($tipo, ['PTT-00', 'LOC-00', 'FOR-00', 'IMP-00', 'EXP-00'], true)) {
                    $isLoaded = false;
                }

                if (strpos($tipo, 'FOR') !== false || strpos($origin, 'CHIH') !== false || strpos($dest, 'CHIH') !== false) {
                    $hasForaneo = true;
                }

                $rawKms = $this->routeResolver->resolve($origin, $dest, (float) ($row['Kms'] ?? 0));
                $kmsAdj = $rawKms;

                $isCruce = false;
                if (strpos($origin, 'EL PASO') !== false && (strpos($dest, 'JUAREZ') !== false || strpos($dest, 'RIO BRAVO') !== false || strpos($dest, 'ZARAGOZA') !== false)) {
                    $isCruce = true;
                }
                if (strpos($dest, 'EL PASO') !== false && (strpos($origin, 'JUAREZ') !== false || strpos($origin, 'RIO BRAVO') !== false || strpos($origin, 'ZARAGOZA') !== false)) {
                    $isCruce = true;
                }
                if ($isCruce && $rawKms >= 40.0) {
                    $kmsAdj = max(0.0, $rawKms - 40.0);
                }

                $totalKmsRaw += $rawKms;
                $totalKmsAdjusted += $kmsAdj;

                if (!$isPac) {
                    $basePay += $isLoaded ? 110.00 : 55.00;
                }

                $cvpt = 'V';
                if (strpos($tipo, 'PT') !== false || strpos($tipo, 'PTT') !== false) {
                    $cvpt = 'PT';
                } elseif ($isLoaded) {
                    $cvpt = 'C';
                }

                $legPay = $isPac ? 0.0 : ($isLoaded ? 110.00 : 55.00);
                $litrosPago = $unitYield > 0 ? round($kmsAdj / $unitYield, 2) : 0.0;

                $tableRows[] = [
                    'Folio_Liquidacion' => trim((string) ($row['Factura'] ?? '')),
                    'Coordenada' => trim((string) ($row['Coordenada'] ?? '')),
                    'Fecha_Salida' => trim((string) ($row['Arranque'] ?? '')),
                    'Fecha_Llegada' => trim((string) ($row['Arribo destino'] ?? '')),
                    'Origen' => trim((string) ($row['Origen'] ?? '')),
                    'Destino' => trim((string) ($row['Destino'] ?? '')),
                    'Kms' => $rawKms,
                    'Recarga' => 0.0,
                    'Rendimiento' => $unitYield,
                    'Peso_Carga' => '',
                    'CVP' => $cvpt,
                    'Remolque' => trim((string) ($row['Remolque'] ?? '')),
                    'Cliente' => trim((string) ($row['Cliente'] ?? '')),
                    'Pago_Por_Km' => $legPay,
                    'Litros_A_Pago' => $litrosPago,
                    'Diesel_A_Favor' => $litrosPago,
                    'Tipo' => trim((string) ($row['Tipo'] ?? '')),
                    'Estatus_Flete' => trim((string) ($row['Estatus flete'] ?? '')),
                    'Is_Loaded' => $isLoaded,
                    // Campo necesario para que PayrollCalculator consulte el tabulador de tarifas
                    'Cruce' => $isCruce ? 'PUENTE ZARAGOZA' : null,
                ];
            }

            $allowedLiters = $totalKmsAdjusted / ($unitYield > 0 ? $unitYield : 2.37341);
            $dieselRate = $isPac ? 16.00 : ($hasForaneo ? 14.85 : 14.50);

            $entries[] = [
                'id' => $driverName . '_' . $boleta,
                'source_type' => 'GENESIS_BOLETA',
                'Boleta' => $boleta,
                'Driver' => $driverName,
                'Unit' => $unit,
                'Start_Date' => $startTs ? date('Y-m-d H:i', $startTs) : 'Desconocido',
                'End_Date' => $endTs ? date('Y-m-d H:i', $endTs) : 'En Progreso',
                'Total_Kms_Raw' => (float) $totalKmsRaw,
                'Total_Kms_Paid' => (float) $totalKmsAdjusted,
                'Allowed_Liters' => round((float) $allowedLiters, 2),
                'Yield_Used' => (float) $unitYield,
                'Base_Pay' => (float) $basePay,
                'Diesel_Rate' => $dieselRate,
                'Suggested_Cost' => round((float) $allowedLiters * $dieselRate, 2),
                'Manual_Refuel_Liters' => 0.0,
                'Manual_Actual_Price_Per_Liter' => 0.0,
                'Manual_Bono_Quimico' => false,
                'Payroll_Week' => $this->getPayrollWeek($startTs),
                'Status' => 'NEEDS_INPUT',
                'Is_Pacifico' => $isPac,
                'Manual_Pac_Loaded' => false,
                'Manual_Pac_Bono_Sierra' => false,
                'Manual_Pac_Bono_Doble' => false,
                'Manual_Pac_Estancia_Obregon' => 0,
                'Manual_Pac_Estancia_Mochis' => 0,
                'Rows' => $tableRows,
            ];
        }

        return $entries;
    }

    private function parseTs(string $str): ?int
    {
        $str = trim($str);
        if ($str === '' || $str === '0') {
            return null;
        }

        $ts = strtotime($str);
        return ($ts !== false && $ts > 0) ? $ts : null;
    }

    private function getPayrollWeek(?int $ts): int
    {
        if (!$ts) {
            return 0;
        }

        return (int) date('W', $ts) + 1;
    }
}
