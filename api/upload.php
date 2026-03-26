<?php
ini_set('display_errors', 0);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['detail' => 'Method not allowed']);
    exit;
}

// ==========================================
// CONSTANTS & TABLES
// ==========================================

$UNIT_YIELDS = [
    'F-002' => 2.37341, 'F-003' => 2.37341, 'F-004' => 2.37341, 'F-005' => 2.37341, 'F-006' => 2.37341, 'F-007' => 2.37341,
    'F-008' => 2.37341, 'F-009' => 2.37341, 'F-010' => 2.37341, 'F-011' => 2.37341, 'F-012' => 2.37341, 'F-013' => 2.37341,
    'F-014' => 2.37341, 'F-015' => 2.37341, 'F-016' => 2.37341, 'F-017' => 2.37341, 'F-019' => 2.37341, 'F-021' => 2.45098,
    'F-022' => 2.45098, 'F-023' => 2.45098, 'F-024' => 2.45098, 'F-025' => 2.45098, 'F-026' => 2.45098, 'F-027' => 2.45098,
    'F-028' => 2.45098, 'F-029' => 2.45098, 'F-030' => 2.45098, 'F-031' => 2.45098, 'F-040' => 2.45098, 'F-033' => 2.45098,
    'F-034' => 2.60127, 'F-035' => 2.60127, 'F-036' => 2.60127, 'F-045' => 2.11267, 'F-042' => 2.45098, 'F-050' => 2.37341,
    'F-051' => 2.11267, 'F-059' => 2.11267, 'F-060' => 2.37341, 'F-061' => 2.37341, 'F-069' => 2.11267, 'F-074' => 2.11267,
    'F-082' => 2.11267, 'F-086' => 2.37341, 'F-087' => 2.37341, 'F-088' => 2.37341, 'F-089' => 2.37341, 'F-090' => 2.37341,
    'F-091' => 2.37341, 'F-092' => 2.37341, 'F-097' => 2.37341, 'F-098' => 2.37341, 'F-099' => 2.37341, 'F-100' => 2.11267,
    'F-107' => 2.37341, 'F-108' => 2.37341, 'F-110' => 2.37341,
    'F-111' => 2.701058, 'F-112' => 2.701058, 'F-121' => 2.701058,
];

$ROUTE_DISTANCES = [
    'JUAREZ|CHIHUAHUA' => 375, 'CHIHUAHUA|JUAREZ' => 375,
    'EL PASO|CHIHUAHUA' => 415, 'CHIHUAHUA|EL PASO' => 415,
    'PRECOS|CHIHUAHUA' => 360, 'CHIHUAHUA|PRECOS' => 360,
];

$ROUTE_DISTANCES_PACIFICO = [
    'JUAREZ|OBREGON' => 1021, 'OBREGON|JUAREZ' => 1021,
    'JUAREZ|GUAMUCHIL' => 1330, 'GUAMUCHIL|JUAREZ' => 1330,
    'OBREGON|GUAMUCHIL' => 328, 'GUAMUCHIL|OBREGON' => 328,
    'CHIHUAHUA|OBREGON' => 1131, 'OBREGON|CHIHUAHUA' => 1131,
    'MOCHIS|GUAMUCHIL' => 106, 'GUAMUCHIL|MOCHIS' => 106,
    'JUAREZ|BACUM' => 1004, 'BACUM|JUAREZ' => 1004,
    'MOCHIS|OBREGON' => 232, 'OBREGON|MOCHIS' => 232,
    'BACUM|OBREGON' => 45, 'OBREGON|BACUM' => 45,
    'CHIHUAHUA|MOCHIS' => 1363, 'MOCHIS|CHIHUAHUA' => 1363,
    'JUAREZ|NAVOJOA' => 1081, 'NAVOJOA|JUAREZ' => 1081,
    'CANANEA|OBREGON' => 551, 'OBREGON|CANANEA' => 551,
    'JUAREZ|CANANEA' => 457, 'CANANEA|JUAREZ' => 457,
    'JUAREZ|ETCHO' => 1118, 'ETCHO|JUAREZ' => 1118,
    'ETCHO|OBREGON' => 97, 'OBREGON|ETCHO' => 97,
    'OBREGON|NAVOJOA' => 67, 'NAVOJOA|OBREGON' => 67,
    'ETCHO|NAVOJOA' => 30, 'NAVOJOA|ETCHO' => 30,
    'OBREGON|CUAHU' => 1236, 'CUAHU|OBREGON' => 1236,
    'ETCHO|JANOS' => 888, 'JANOS|ETCHO' => 888,
    'JANOS|OBREGON' => 795, 'OBREGON|JANOS' => 795,
    'NOGALES|JUAREZ' => 603, 'JUAREZ|NOGALES' => 603,
    'S. RIO COL.|HERMOSILLO' => 630,
    'HERMOSILLO|OBREGON' => 255,
    'CHIHUAHUA|CUAHU' => 145, 'CUAHU|CHIHUAHUA' => 145,
    'S. RIO COL.|EMPALME' => 772,
    'EMPALME|OBREGON' => 120,
    'JANOS|GUAMUCHIL' => 1120, 'GUAMUCHIL|JANOS' => 1120,
    'JUAREZ|JANOS' => 219, 'JANOS|JUAREZ' => 219,
    'JANOS|MOCHIS' => 1027,
    'JUAREZ|CUAHU' => 480, 'CUAHU|JUAREZ' => 480,
    'S. RIO COL.|JUAREZ' => 1037, 'JUAREZ|S. RIO COL.' => 1037,
    'CHIHUAHUA|JANOS' => 348, 'JANOS|CHIHUAHUA' => 348,
    'S. RIO COL.|OBREGON' => 885,
    'JUAREZ|MOCHIS' => 1254, 'MOCHIS|JUAREZ' => 1224,
    'JUAREZ|HERMOSILLO' => 800,
];

$ROUTE_DISTANCES_CLIENTS = [
    'GYSA ASCENCION|FLETES SOTELO' => 200,
    'APTIV GUAMUCHIL FV52|APTIV / RIO BRAVO 7 FV32' => 1330,
    'APTIV GUAMUCHIL FV52|FLETES SOTELO' => 1330,
    'ATLAS AEROSPACE|FLETES SOTELO' => 375,
    'ATLAS AEROSPACE|PRECOS ZARAGOZA' => 375,
    'BASE SOTELO CHIHUAHUA|CASETA DE VILLA AHUMADA' => 130,
    'BASE SOTELO CHIHUAHUA|FLETES SOTELO' => 375,
    'BASE SOTELO CHIHUAHUA|PRECOS ZARAGOZA' => 375,
    'BASE SOTELO CHIHUAHUA|YARDA DEL SIETE' => 375,
    'DTR|PRECOS ZARAGOZA' => 375,
    'DTR|FLETES SOTELO' => 375,
    'GYSA OBREGON 2|FLETES SOTELO' => 1021,
    'IMPULSORA GANE|FLETES SOTELO' => 375,
    'NORDAM|FLETES SOTELO' => 375,
    'NORDAM|PRECOS ZARAGOZA' => 375,
    'PACTIV DE MEXICO S. DE R.L DE C.V.|FLETES SOTELO' => 375,
    'SAFRAN PLANTA 3/OSM/OXYGEN SYSTEMS|FLETES SOTELO' => 375,
    'SAFRAN PLANTA 3 /WWM/ WATER & WASTE MEX (MONOGRAM)|FLETES SOTELO' => 375,
    'SMTC PLANTA 1|FLETES SOTELO' => 375,
    'THUASNE MX|FLETES SOTELO' => 375,
    'XOMOX CHIHUAHUA S.A DE C.V.|FLETES SOTELO' => 375,
    'YARDA SOTELO OBREGON|FLETES SOTELO' => 1021,
    'YARDA SOTELO OBREGON|PRECOS ZARAGOZA' => 1021,
    'YAZAKI COMPONENTES PLANTA 3|FLETES SOTELO' => 375,
    'APTIV MOCHIS FV59|YARDA SOTELO OBREGON' => 232,
    'DEMINSA SA DE CV|YARDA SOTELO OBREGON' => 255,
    'FLETES SOTELO|APTIV GUAMUCHIL FV52' => 1330,
    'FLETES SOTELO|BASE SOTELO CHIHUAHUA' => 375,
    'FLETES SOTELO|IMPULSORA GANE' => 375,
    'FLETES SOTELO|YARDA SOTELO OBREGON' => 1021,
    'FLETES SOTELO|YAZAKI COMPONENTES PLANTA 3' => 375,
    'GYSA  CDJ|FLETES SOTELO' => 375,
    'GYSA BACUM|GYSA OBREGON PDC' => 45,
    'GYSA BACUM|YARDA SOTELO OBREGON' => 45,
    'GYSA ETCHOJOA|GYSA OBREGON PDC' => 97,
    'GYSA NAVOJOA|GYSA OBREGON ODC' => 67,
    'GYSA NAVOJOA|GYSA OBREGON PDC' => 67,
    'GYSA NAVOJOA|YARDA SOTELO OBREGON' => 67,
    'GYSA OBREGON ODC|GYSA BACUM' => 45,
    'YARDA SOTELO OBREGON|GYSA BACUM' => 45,
    'GYSA OBREGON ODC|GYSA ETCHOJOA' => 97,
    'GYSA OBREGON ODC|GYSA NAVOJOA' => 67,
    'SAFRAN PLANTA 1 /EMX/ EVACUATION SY (AIR CRUSIERS)|FLETES SOTELO' => 375,
    'YARDA SOTELO OBREGON|GYSA ETCHOJOA' => 97,
    'APTIV / RIO BRAVO 7 FV32|APTIV GUAMUCHIL FV52' => 1330,
    'APTIV MOCHIS FV59|APTIV GUAMUCHIL FV52' => 106,
    'BASE SOTELO CHIHUAHUA|APTIV MOCHIS FV59' => 1363,
    'BASE SOTELO CHIHUAHUA|APTIV RIO BRAVO 4 FV33' => 375,
    'BASE SOTELO CHIHUAHUA|GYSA JUAREZ JDC' => 375,
    'BASE SOTELO CHIHUAHUA|GYSA OBREGON PDC' => 1131,
    'COFICAB LEON, S. DE R.L. DE C.V. / PLANTA JUAREZ|TE CONNECTIVITY HERMOSILLO' => 800,
    'COFICAB LEON, S. DE R.L. DE C.V. / PLANTA JUAREZ|GYSA OBREGON PDC' => 1021,
    'FLETES SOTELO|APTIV MOCHIS FV59' => 1224,
    'FLETES SOTELO|GYSA ASCENCION' => 200,
    'FLETES SOTELO|GYSA BACUM' => 1004,
    'FLETES SOTELO|GYSA ETCHOJOA' => 1118,
    'FLETES SOTELO|GYSA OBREGON 1' => 1021,
    'FLETES SOTELO|GYSA OBREGON 2' => 1021,
    'FLETES SOTELO|GYSA OBREGON PDC' => 1021,
    'FLETES SOTELO|HUNGAROS / NOGALES' => 600,
    'GYSA  CDJ|YARDA SOTELO OBREGON' => 1021,
    'GYSA BACUM|GYSA NAVOJOA' => 112,
    'GYSA BACUM|GYSA OBREGON (CDO2)' => 45,
    'GYSA BACUM|GYSA OBREGON 2' => 45,
    'GYSA BACUM|GYSA OBREGON ODC' => 45,
    'GYSA ETCHOJOA|FLETES SOTELO' => 1118,
    'GYSA ETCHOJOA|GYSA  CDJ' => 1118,
    'GYSA ETCHOJOA|GYSA OBREGON ODC' => 97,
    'GYSA JUAREZ JDC|GYSA OBREGON 2' => 1021,
    'GYSA OBREGON 2|GYSA ETCHOJOA' => 97,
    'GYSA OBREGON PDC|GYSA BACUM' => 45,
    'GYSA OBREGON PDC|GYSA ETCHOJOA' => 97,
    'GYSA OBREGON PDC|GYSA NAVOJOA' => 67,
    'TRANSERVICIOS CHIHUAHUA|TRANSERVICIOS CD JUAREZ' => 375,
    'YARDA SOTELO OBREGON|GYSA  CDJ' => 1021,
    'YAZAKI COMPONENTES PLANTA 3|GYSA JUAREZ JDC' => 1131,
    'YAZAKI COMPONENTES PLANTA 3|GYSA OBREGON PDC' => 1131,
    'FLETES SOTELO|ARNPRIOR AEROSPACE CHIHUAHUA' => 375,
    'FLETES SOTELO|CESSNA PLANTA 4.1' => 375,
    'FLETES SOTELO|DEMINSA SA DE CV' => 800,
    'FLETES SOTELO|DTR' => 375,
    'FLETES SOTELO|FOKKER' => 375,
    'FLETES SOTELO|SAFRAN CABIN' => 375,
    'FLETES SOTELO|SAFRAN PLANTA 1 /EMX/ EVACUATION SY (AIR CRUSIERS)' => 375,
    'FLETES SOTELO|SMTC PLANTA 1' => 375,
    'FLETES SOTELO|SOUTHCO.' => 375,
    'FLETES SOTELO|XOMOX CHIHUAHUA S.A DE C.V.' => 375,
    'FLETES SOTELO|XYLEM' => 375,
    'FLETES SOTELO|YAZAKI COMPONENTES PLANTA 2' => 375,
    'FREIG CARRILLO / NOGALES AZ|GYSA  CDJ' => 800,
    'PRECOS ZARAGOZA|BASE SOTELO CHIHUAHUA' => 375,
    'PRECOS ZARAGOZA|DTR' => 375,
    'PRECOS ZARAGOZA|FOKKER' => 375,
    'PRECOS ZARAGOZA|SAFRAN CABIN' => 375,
    'PRECOS ZARAGOZA|SAFRAN PLANTA 1 /EMX/ EVACUATION SY (AIR CRUSIERS)' => 375,
    'PRECOS ZARAGOZA|SAFRAN PLANTA 3 /WWM/ WATER & WASTE MEX (MONOGRAM)' => 375,
    'PRECOS ZARAGOZA|SAFRAN PLANTA 5 / ELM / ELECTRIC MEXICO (SEPS)' => 375,
    'PRECOS ZARAGOZA|SAFRAN PLANTA 5 / LSM/ LIGHTING SOLUTIONS (IDD)' => 375,
    'PRECOS ZARAGOZA|SMTC PLANTA 1' => 375,
    'PRECOS ZARAGOZA|SOUTHCO.' => 375,
    'PRECOS ZARAGOZA|WIREMASTERS' => 375,
    'PRECOS ZARAGOZA|XYLEM' => 375,
    'PRECOS ZARAGOZA|YAZAKI COMPONENTES PLANTA 2' => 375,
    'CASETA DE VILLA AHUMADA|PRECOS ZARAGOZA' => 130,
    'CENTURY MOLD MEXICO S DE RL DE CV|FLETES SOTELO' => 375,
    'CESSNA PLANTA 4.1|BASE SOTELO CHIHUAHUA' => 375,
    'GYSA JUAREZ JDC|BASE SOTELO CHIHUAHUA' => 375,
    'YARDA SOTELO OBREGON|GYSA NAVOJOA' => 67,
];

$PACIFICO_KEYWORDS = [
    'OBRG', 'OBREGON', 'MOCHIS', 'GUAMUCHIL', 'NAVOJOA', 'CANANEA',
    'ETCHO', 'JANOS', 'NOGALES', 'S. RIO COL', 'HERMOSILLO', 'EMPALME',
    'BACUM', 'GYSA', 'YARDA SOTELO',
];

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function is_pacifico_loc(string $loc): bool {
    global $PACIFICO_KEYWORDS;
    $loc_up = strtoupper(trim($loc));
    foreach ($PACIFICO_KEYWORDS as $kw) {
        if (strpos($loc_up, $kw) !== false) return true;
    }
    return false;
}

function get_route_kms(string $origin, string $dest, $row_kms = 0): float {
    global $ROUTE_DISTANCES, $ROUTE_DISTANCES_PACIFICO, $ROUTE_DISTANCES_CLIENTS;

    $org_up  = strtoupper(trim($origin));
    $dest_up = strtoupper(trim($dest));
    $key     = "$org_up|$dest_up";

    if (isset($ROUTE_DISTANCES_CLIENTS[$key])) {
        return (float)$ROUTE_DISTANCES_CLIENTS[$key];
    }

    $org_norm = $org_up;
    if (strpos($org_up, 'JRZ') !== false || strpos($org_up, 'JUAREZ') !== false || strpos($org_up, 'BASE') !== false) $org_norm = 'JUAREZ';
    if (strpos($org_up, 'EL PASO') !== false || strpos($org_up, 'RIO BRAVO') !== false) $org_norm = 'EL PASO';
    if (strpos($org_up, 'CHIH') !== false) $org_norm = 'CHIHUAHUA';

    $dest_norm = $dest_up;
    if (strpos($dest_up, 'JRZ') !== false || strpos($dest_up, 'JUAREZ') !== false || strpos($dest_up, 'BASE') !== false) $dest_norm = 'JUAREZ';
    if (strpos($dest_up, 'EL PASO') !== false || strpos($dest_up, 'RIO BRAVO') !== false) $dest_norm = 'EL PASO';
    if (strpos($dest_up, 'CHIH') !== false) $dest_norm = 'CHIHUAHUA';

    $key_norm = "$org_norm|$dest_norm";
    if (isset($ROUTE_DISTANCES[$key_norm])) {
        return (float)$ROUTE_DISTANCES[$key_norm];
    }

    $pac_org  = (strpos($org_norm,  'OBR') !== false) ? 'OBREGON' : $org_norm;
    $pac_dest = (strpos($dest_norm, 'OBR') !== false) ? 'OBREGON' : $dest_norm;
    $key_pac  = "$pac_org|$pac_dest";
    if (isset($ROUTE_DISTANCES_PACIFICO[$key_pac])) {
        return (float)$ROUTE_DISTANCES_PACIFICO[$key_pac];
    }

    $val = (float)$row_kms;
    if ($val > 0) return $val;
    return 0.0;
}

function parse_ts(string $str): ?int {
    $str = trim($str);
    if ($str === '' || $str === '0') return null;
    $ts = strtotime($str);
    return ($ts !== false && $ts > 0) ? $ts : null;
}

function get_payroll_week(?int $ts): int {
    if (!$ts) return 0;
    return (int)date('W', $ts) + 1;
}

// ==========================================
// BOLETA-BASED PROCESSING
// ==========================================

/**
 * Process rows grouped by Boleta number.
 * Each unique boleta becomes one card entry.
 */
function process_by_boleta(array $rows, string $driver_name): array {
    global $UNIT_YIELDS;

    // Group by boleta
    $byBoleta = [];
    foreach ($rows as $row) {
        $boleta = trim($row['Boleta'] ?? '');
        if ($boleta === '') $boleta = 'SIN_BOLETA';
        $byBoleta[$boleta][] = $row;
    }

    $entries = [];

    foreach ($byBoleta as $boleta => $boletaRows) {
        // Sort rows by Arranque date
        usort($boletaRows, function ($a, $b) {
            $ta = parse_ts($a['Arranque'] ?? '');
            $tb = parse_ts($b['Arranque'] ?? '');
            return ($ta ?? 0) <=> ($tb ?? 0);
        });

        // First row metadata
        $firstRow   = $boletaRows[0];
        $unit       = trim($firstRow['Tractor'] ?? '');
        $unit_yield = $UNIT_YIELDS[$unit] ?? 2.37341;

        // Detect Pacifico
        $is_pac = false;
        foreach ($boletaRows as $row) {
            if (is_pacifico_loc($row['Origen'] ?? '') || is_pacifico_loc($row['Destino'] ?? '')) {
                $is_pac = true;
                break;
            }
        }

        // Compute financial values from rows
        $base_pay           = 0.0;
        $total_kms_raw      = 0.0;
        $total_kms_adjusted = 0.0;
        $has_foraneo        = false;
        $start_ts           = null;
        $end_ts             = null;
        $table_rows         = [];

        foreach ($boletaRows as $row) {
            $origin  = strtoupper(trim($row['Origen']  ?? ''));
            $dest    = strtoupper(trim($row['Destino'] ?? ''));
            $status  = strtoupper(trim($row['Estatus flete'] ?? ''));
            $tipo    = strtoupper(trim($row['Tipo']    ?? ''));
            $coments = strtoupper(trim($row['Comentarios'] ?? ''));

            // Timestamps
            $ts_start = parse_ts($row['Arranque'] ?? '');
            $ts_end   = parse_ts($row['Arribo destino'] ?? '');
            if ($ts_start && ($start_ts === null || $ts_start < $start_ts)) $start_ts = $ts_start;
            if ($ts_end   && ($end_ts   === null || $ts_end   > $end_ts))   $end_ts   = $ts_end;

            // Loaded determination
            $is_loaded = ($status === 'FACTURADO')
                      || in_array($tipo, ['IMP-01','IMP-02','EXP-01','EXP-02','FOR-01','FOR-02','MDC-01','MDC-02','TRI-01','TRI-02','TRE-01','TRE-02','LOC-01','LOC-02'], true);
            if (strpos($coments, 'VACIO') !== false
             || strpos($coments, 'VASIO') !== false
             || $status === 'COMPLETO'
             || $tipo === 'PTT-00' || $tipo === 'LOC-00' || $tipo === 'FOR-00' || $tipo === 'IMP-00' || $tipo === 'EXP-00') {
                $is_loaded = false;
            }

            if (strpos($tipo, 'FOR') !== false || strpos($origin, 'CHIH') !== false || strpos($dest, 'CHIH') !== false) {
                $has_foraneo = true;
            }

            // KM calculations
            $raw_kms = get_route_kms($origin, $dest, $row['Kms'] ?? 0);
            $kms_adj = $raw_kms;

            $is_cruce = false;
            if (strpos($origin, 'EL PASO') !== false && (strpos($dest, 'JUAREZ') !== false || strpos($dest, 'RIO BRAVO') !== false || strpos($dest, 'ZARAGOZA') !== false)) $is_cruce = true;
            if (strpos($dest, 'EL PASO') !== false && (strpos($origin, 'JUAREZ') !== false || strpos($origin, 'RIO BRAVO') !== false || strpos($origin, 'ZARAGOZA') !== false)) $is_cruce = true;
            if ($is_cruce && $raw_kms >= 40.0) $kms_adj = max(0.0, $raw_kms - 40.0);

            $total_kms_raw      += $raw_kms;
            $total_kms_adjusted += $kms_adj;

            // Base pay (Pacifico has flat rate, Chihuahua has leg rates)
            if (!$is_pac) {
                $base_pay += $is_loaded ? 110.00 : 55.00;
            }

            // Determine C/V/PT label
            $cvpt = 'V'; // Vacío by default
            if (strpos($tipo, 'PT') !== false || strpos($tipo, 'PTT') !== false) {
                $cvpt = 'PT';
            } elseif ($is_loaded) {
                $cvpt = 'C';
            }

            // Per-row financial calculations
            $leg_pay       = $is_pac ? 0.0 : ($is_loaded ? 110.00 : 55.00);
            $litros_pago   = $unit_yield > 0 ? round($kms_adj / $unit_yield, 2) : 0.0;
            $diesel_favor  = $litros_pago; // starts equal to allowed (recarga = 0)

            // Build table row for frontend
            $table_rows[] = [
                'Folio_Liquidacion' => trim($row['Factura'] ?? ''),
                'Coordenada'        => trim($row['Coordenada'] ?? ''),
                'Fecha_Salida'      => trim($row['Arranque'] ?? ''),
                'Fecha_Llegada'     => trim($row['Arribo destino'] ?? ''),
                'Origen'            => trim($row['Origen'] ?? ''),
                'Destino'           => trim($row['Destino'] ?? ''),
                'Kms'               => $raw_kms,
                'Recarga'           => 0.0,
                'Rendimiento'       => (float)$unit_yield,
                'Peso_Carga'        => '',
                'CVP'               => $cvpt,
                'Remolque'          => trim($row['Remolque'] ?? ''),
                'Cliente'           => trim($row['Cliente'] ?? ''),
                'Pago_Por_Km'       => $leg_pay,
                'Litros_A_Pago'     => $litros_pago,
                'Diesel_A_Favor'    => $diesel_favor,
                'Tipo'              => trim($row['Tipo'] ?? ''),
                'Estatus_Flete'     => trim($row['Estatus flete'] ?? ''),
                'Is_Loaded'         => $is_loaded,
            ];
        }

        $allowed_liters = $total_kms_adjusted / ($unit_yield > 0 ? $unit_yield : 2.37341);
        $diesel_rate    = $is_pac ? 16.00 : ($has_foraneo ? 14.85 : 14.50);

        $entries[] = [
            'id'                         => "{$driver_name}_{$boleta}",
            'source_type'                => 'GENESIS_BOLETA',
            'Boleta'                     => $boleta,
            'Driver'                     => $driver_name,
            'Unit'                       => $unit,
            'Start_Date'                 => $start_ts ? date('Y-m-d H:i', $start_ts) : 'Desconocido',
            'End_Date'                   => $end_ts   ? date('Y-m-d H:i', $end_ts)   : 'En Progreso',
            'Total_Kms_Raw'              => (float)$total_kms_raw,
            'Total_Kms_Paid'             => (float)$total_kms_adjusted,
            'Allowed_Liters'             => round((float)$allowed_liters, 2),
            'Yield_Used'                 => (float)$unit_yield,
            'Base_Pay'                   => (float)$base_pay,
            'Diesel_Rate'                => $diesel_rate,
            'Suggested_Cost'             => round((float)$allowed_liters * $diesel_rate, 2),
            'Manual_Refuel_Liters'       => 0.0,
            'Manual_Actual_Price_Per_Liter' => 0.0,
            'Manual_Bono_Quimico'        => false,
            'Payroll_Week'               => get_payroll_week($start_ts),
            'Status'                     => 'NEEDS_INPUT',
            'Is_Pacifico'                => $is_pac,
            'Manual_Pac_Loaded'          => false,
            'Manual_Pac_Bono_Sierra'     => false,
            'Manual_Pac_Bono_Doble'      => false,
            'Manual_Pac_Estancia_Obregon'=> 0,
            'Manual_Pac_Estancia_Mochis' => 0,
            'Rows'                       => $table_rows,
        ];
    }

    return $entries;
}

// ==========================================
// MAIN HANDLER
// ==========================================
try {
    if (!isset($_FILES['file'])) {
        http_response_code(400);
        echo json_encode(['detail' => 'No se recibio ningun archivo.']);
        exit;
    }

    $file     = $_FILES['file'];
    $filename = $file['name'];
    $ext      = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

    if (!in_array($ext, ['csv', 'xlsx', 'xls'], true)) {
        http_response_code(400);
        echo json_encode(['detail' => 'Tipo de archivo invalido. Sube un CSV o Excel de Genesis.']);
        exit;
    }

    if ($ext !== 'csv') {
        http_response_code(400);
        echo json_encode(['detail' => 'Archivos Excel no estan soportados en esta version. Por favor exporta el reporte de Genesis como CSV e intentalo de nuevo.']);
        exit;
    }

    $content = file_get_contents($file['tmp_name']);

    // Encoding fix
    $enc = mb_detect_encoding($content, ['UTF-8', 'ISO-8859-1', 'Windows-1252'], true);
    if ($enc && $enc !== 'UTF-8') {
        $content = mb_convert_encoding($content, 'UTF-8', $enc);
    }

    // Parse CSV
    $handle = fopen('php://temp', 'r+');
    fwrite($handle, $content);
    rewind($handle);

    $headers = fgetcsv($handle);
    if (!$headers) {
        fclose($handle);
        http_response_code(400);
        echo json_encode(['detail' => 'Archivo CSV invalido o vacio.']);
        exit;
    }
    $headers = array_map('trim', $headers);

    // Strip BOM from first header if present
    if (isset($headers[0])) {
        $headers[0] = ltrim($headers[0], "\xEF\xBB\xBF\xFF\xFE");
    }

    $rows = [];
    while (($row = fgetcsv($handle)) !== false) {
        if (count($row) === count($headers)) {
            $rows[] = array_combine($headers, $row);
        }
    }
    fclose($handle);

    if (empty($rows)) {
        http_response_code(400);
        echo json_encode(['detail' => 'El archivo no contiene datos.']);
        exit;
    }

    // Check if CSV has the Boleta column (Genesis with boleta format)
    $hasBoleta = in_array('Boleta', $headers, true);

    // Group by driver
    $byDriver = [];
    foreach ($rows as $row) {
        $driver = trim($row['Conductor'] ?? '');
        if ($driver === '') continue;
        $byDriver[$driver][] = $row;
    }

    $results = [];

    if ($hasBoleta) {
        // New flow: group by Conductor > Boleta
        foreach ($byDriver as $driver => $driverRows) {
            $entries = process_by_boleta($driverRows, $driver);
            $results = array_merge($results, $entries);
        }
    } else {
        // Legacy flow: bundle movements into trips (kept for backwards compat)
        foreach ($byDriver as $driver => $driverRows) {
            // Simple bundling fallback
            $entries = process_by_boleta($driverRows, $driver);
            $results = array_merge($results, $entries);
        }
    }

    echo json_encode(['trips' => $results]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['detail' => $e->getMessage()]);
}
