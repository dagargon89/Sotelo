<?php

namespace App\Libraries;

use App\Models\TabuladorModel;

class PayrollCalculator
{
    private ?TabuladorModel $tabuladorModel;

    public function __construct(?TabuladorModel $tabuladorModel = null)
    {
        // Se permite inyectar null para facilitar tests unitarios sin BD
        $this->tabuladorModel = $tabuladorModel ?? new TabuladorModel();
    }

    /** @param array<string, mixed> $trip */
    public function calculate(array $trip): array
    {
        $isPac           = (bool) ($trip['Is_Pacifico'] ?? false);
        $kmsPaid         = (float) ($trip['Total_Kms_Paid'] ?? 0);
        $rate            = (float) ($trip['Diesel_Rate'] ?? 0);
        $bonoQuimicoVal  = (bool) ($trip['Manual_Bono_Quimico'] ?? false) ? 250.0 : 0.0;

        if (!empty($trip['Rows']) && is_array($trip['Rows'])) {
            $totalIncentive  = 0.0;
            $totalKms        = 0.0;
            $totalBasePay    = 0.0;
            $totalRecarga    = 0.0;
            $totalLitrosPago = 0.0;

            // ── Resolución de tarifa por tabulador ──────────────────────────
            // Se acumulan los pagos de cruce por cada Row que tenga tarifa.
            $totalPagoCruce   = 0.0;
            $reglaAplicada    = null;
            $fuenteTarifa     = 'PAGO_BASE_LEGACY';
            $motivoSinTarifa  = null;
            $rowsConTarifa    = 0;
            $rowsSinTarifa    = 0;

            foreach ($trip['Rows'] as $row) {
                $dieselAFavor  = (float) ($row['Diesel_A_Favor'] ?? 0);
                $recarga       = (float) ($row['Recarga'] ?? 0);
                $litrosAPago   = (float) ($row['Litros_A_Pago'] ?? 0);
                $pagoKm        = (float) ($row['Pago_Por_Km'] ?? 0);
                $kms           = (float) ($row['Kms'] ?? 0);
                $tipoRow       = strtoupper(trim((string) ($row['Tipo'] ?? '')));
                $cruceRow      = isset($row['Cruce']) && $row['Cruce'] !== '' ? (string) $row['Cruce'] : null;
                $origenRow     = strtoupper(trim((string) ($row['Origen'] ?? ''))) ?: null;
                $destinoRow    = strtoupper(trim((string) ($row['Destino'] ?? ''))) ?: null;

                $totalIncentive  += max(0.0, $dieselAFavor);
                $totalRecarga    += $recarga;
                $totalLitrosPago += $litrosAPago;
                $totalKms        += $kms;
                $totalBasePay    += $pagoKm;

                // Consultar tabulador si el row tiene tipo
                if ($tipoRow !== '' && $this->tabuladorModel !== null) {
                    $tarifa = $this->tabuladorModel->getTarifa($tipoRow, $cruceRow, $origenRow, $destinoRow);

                    if ($tarifa !== null) {
                        $totalPagoCruce += (float) ($tarifa['pago_operador'] ?? 0);
                        $fuenteTarifa    = 'TABULADOR_BD';
                        $rowsConTarifa++;
                        // Conservar la regla más específica que se encontró
                        if ($reglaAplicada === null || ($tarifa['nivel_match'] ?? 99) < ($trip['_nivel_min'] ?? 99)) {
                            $reglaAplicada          = $tipoRow;
                            $trip['_nivel_min']     = $tarifa['nivel_match'] ?? 99;
                            $trip['_regla_detalle'] = $tarifa['regla'] ?? '';
                        }
                    } else {
                        $rowsSinTarifa++;
                    }
                }
            }

            // Limpiar claves internas de trabajo
            unset($trip['_nivel_min'], $trip['_regla_detalle']);

            if ($fuenteTarifa === 'TABULADOR_BD') {
                if ($rowsSinTarifa > 0) {
                    $motivoSinTarifa = 'TARIFA_PARCIAL_' . $rowsSinTarifa . '_ROWS_SIN_MATCH';
                }
            } elseif ($rowsSinTarifa > 0) {
                $motivoSinTarifa = 'SIN_TARIFA_APLICABLE';
            }

            $savings = $totalLitrosPago - $totalRecarga;

            if ($isPac) {
                $pacRate = ($trip['Manual_Pac_Loaded'] ?? false) ? 0.30 : 0.15;
                $basePay = $kmsPaid > 0 ? $kmsPaid * $pacRate : $totalKms * $pacRate;

                $bonuses = 0.0;
                if ($trip['Manual_Pac_Bono_Sierra'] ?? false) {
                    $bonuses += 500.0;
                }
                if ($trip['Manual_Pac_Bono_Doble'] ?? false) {
                    $bonuses += 1726.0;
                }
                $bonuses += (int) ($trip['Manual_Pac_Estancia_Obregon'] ?? 0) * 600.0;
                $bonuses += (int) ($trip['Manual_Pac_Estancia_Mochis'] ?? 0) * 300.0;

                $trip['Base_Pay'] = $basePay;
                $totalPay         = $basePay + $bonuses + $totalIncentive + $bonoQuimicoVal;
            } else {
                $basePay = $totalBasePay > 0 ? $totalBasePay : (float) ($trip['Base_Pay'] ?? 0);
                $trip['Base_Pay'] = $basePay;
                $totalPay         = $basePay + $totalIncentive + $bonoQuimicoVal;
            }

            $trip['Manual_Refuel_Liters'] = $totalRecarga;
            $trip['Allowed_Liters']       = round($totalLitrosPago, 2);
            $trip['Diesel_Savings']       = round($savings, 2);
            $trip['Incentive_Pay']        = round($totalIncentive, 2);
            $trip['Total_Pay']            = round($totalPay, 2);

            // ── Campos del tabulador de tarifas de cruce ─────────────────────
            $trip['Pago_Cruce']      = $fuenteTarifa === 'TABULADOR_BD' ? round($totalPagoCruce, 2) : null;
            $trip['Regla_Aplicada']  = $reglaAplicada;
            $trip['Fuente_Tarifa']   = $fuenteTarifa;
            $trip['Motivo_Sin_Tarifa'] = $motivoSinTarifa;

        } else {
            // ── Modo clásico (legacy): usar campos globales del trip ──────────
            $allowed      = (float) ($trip['Allowed_Liters'] ?? 0);
            $refueled     = (float) ($trip['Manual_Refuel_Liters'] ?? 0);
            $manualPrice  = (float) ($trip['Manual_Actual_Price_Per_Liter'] ?? 0);
            $effectiveRate = $manualPrice > 0 ? $manualPrice : $rate;

            $savings  = max(0.0, $allowed - $refueled);
            $incentive = $savings * $effectiveRate;

            if ($isPac) {
                $pacRate = ($trip['Manual_Pac_Loaded'] ?? false) ? 0.30 : 0.15;
                $basePay = $kmsPaid * $pacRate;

                $bonuses = 0.0;
                if ($trip['Manual_Pac_Bono_Sierra'] ?? false) {
                    $bonuses += 500.0;
                }
                if ($trip['Manual_Pac_Bono_Doble'] ?? false) {
                    $bonuses += 1726.0;
                }
                $bonuses += (int) ($trip['Manual_Pac_Estancia_Obregon'] ?? 0) * 600.0;
                $bonuses += (int) ($trip['Manual_Pac_Estancia_Mochis'] ?? 0) * 300.0;

                $trip['Base_Pay'] = $basePay;
                $totalPay         = $basePay + $bonuses + $incentive + $bonoQuimicoVal;
            } else {
                $totalPay = (float) ($trip['Base_Pay'] ?? 0) + $incentive + $bonoQuimicoVal;
            }

            $trip['Diesel_Savings'] = round($savings, 2);
            $trip['Incentive_Pay']  = round($incentive, 2);
            $trip['Total_Pay']      = round($totalPay, 2);

            // En modo legacy no hay tabulador disponible
            $trip['Pago_Cruce']       = null;
            $trip['Regla_Aplicada']   = null;
            $trip['Fuente_Tarifa']    = 'PAGO_BASE_LEGACY';
            $trip['Motivo_Sin_Tarifa'] = null;
        }

        if (($trip['Status'] ?? '') === 'NEEDS_INPUT') {
            $trip['Status'] = 'PENDING';
        }

        return $trip;
    }
}
