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
    'F-002' => 2.37341, 'F-003' => 2.37341, 'F-004' => 2.37341, 'F-005' => 2.37341,
    'F-006' => 2.37341, 'F-007' => 2.37341, 'F-008' => 2.37341, 'F-009' => 2.37341,
    'F-010' => 2.37341, 'F-011' => 2.37341, 'F-012' => 2.37341, 'F-013' => 2.37341,
    'F-014' => 2.37341, 'F-015' => 2.37341, 'F-016' => 2.37341, 'F-017' => 2.37341,
    'F-019' => 2.37341, 'F-050' => 2.37341, 'F-060' => 2.37341, 'F-061' => 2.37341,
    'F-086' => 2.37341, 'F-087' => 2.37341, 'F-088' => 2.37341, 'F-089' => 2.37341,
    'F-090' => 2.37341, 'F-091' => 2.37341, 'F-092' => 2.37341, 'F-097' => 2.37341,
    'F-098' => 2.37341, 'F-099' => 2.37341, 'F-107' => 2.37341, 'F-108' => 2.37341,
    'F-110' => 2.37341,
    'F-021' => 2.45098, 'F-022' => 2.45098, 'F-023' => 2.45098, 'F-024' => 2.45098,
    'F-025' => 2.45098, 'F-026' => 2.45098, 'F-027' => 2.45098, 'F-028' => 2.45098,
    'F-029' => 2.45098, 'F-030' => 2.45098, 'F-031' => 2.45098, 'F-033' => 2.45098,
    'F-040' => 2.45098, 'F-042' => 2.45098,
    'F-034' => 2.60127, 'F-035' => 2.60127, 'F-036' => 2.60127,
    'F-045' => 2.11267, 'F-051' => 2.11267, 'F-059' => 2.11267, 'F-069' => 2.11267,
    'F-074' => 2.11267, 'F-082' => 2.11267, 'F-100' => 2.11267,
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
    'BASE SOTELO CHIHUAHUA|APTIV MOCHIS FV59' => 1363,
    'BASE SOTELO CHIHUAHUA|APTIV RIO BRAVO 4 FV33' => 375,
    'BASE SOTELO CHIHUAHUA|GYSA JUAREZ JDC' => 375,
    'BASE SOTELO CHIHUAHUA|GYSA OBREGON PDC' => 1131,
    'DTR|PRECOS ZARAGOZA' => 375,
    'DTR|FLETES SOTELO' => 375,
    'GYSA OBREGON 2|FLETES SOTELO' => 1021,
    'GYSA OBREGON 2|GYSA ETCHOJOA' => 97,
    'IMPULSORA GANE|FLETES SOTELO' => 375,
    'NORDAM|FLETES SOTELO' => 375,
    'NORDAM|PRECOS ZARAGOZA' => 375,
    'PACTIV DE MEXICO S. DE R.L DE C.V.|FLETES SOTELO' => 375,
    'SAFRAN PLANTA 3/OSM/OXYGEN SYSTEMS|FLETES SOTELO' => 375,
    'SAFRAN PLANTA 3 /WWM/ WATER & WASTE MEX (MONOGRAM)|FLETES SOTELO' => 375,
    'SAFRAN PLANTA 1 /EMX/ EVACUATION SY (AIR CRUSIERS)|FLETES SOTELO' => 375,
    'SMTC PLANTA 1|FLETES SOTELO' => 375,
    'THUASNE MX|FLETES SOTELO' => 375,
    'XOMOX CHIHUAHUA S.A DE C.V.|FLETES SOTELO' => 375,
    'YARDA SOTELO OBREGON|FLETES SOTELO' => 1021,
    'YARDA SOTELO OBREGON|PRECOS ZARAGOZA' => 1021,
    'YARDA SOTELO OBREGON|GYSA BACUM' => 45,
    'YARDA SOTELO OBREGON|GYSA ETCHOJOA' => 97,
    'YARDA SOTELO OBREGON|GYSA  CDJ' => 1021,
    'YAZAKI COMPONENTES PLANTA 3|FLETES SOTELO' => 375,
    'YAZAKI COMPONENTES PLANTA 3|GYSA JUAREZ JDC' => 1131,
    'YAZAKI COMPONENTES PLANTA 3|GYSA OBREGON PDC' => 1131,
    'APTIV MOCHIS FV59|YARDA SOTELO OBREGON' => 232,
    'APTIV MOCHIS FV59|APTIV GUAMUCHIL FV52' => 106,
    'APTIV / RIO BRAVO 7 FV32|APTIV GUAMUCHIL FV52' => 1330,
    'DEMINSA SA DE CV|YARDA SOTELO OBREGON' => 255,
    'FLETES SOTELO|APTIV GUAMUCHIL FV52' => 1330,
    'FLETES SOTELO|APTIV MOCHIS FV59' => 1224,
    'FLETES SOTELO|BASE SOTELO CHIHUAHUA' => 375,
    'FLETES SOTELO|IMPULSORA GANE' => 375,
    'FLETES SOTELO|YARDA SOTELO OBREGON' => 1021,
    'FLETES SOTELO|YAZAKI COMPONENTES PLANTA 3' => 375,
    'FLETES SOTELO|GYSA ASCENCION' => 200,
    'FLETES SOTELO|GYSA BACUM' => 1004,
    'FLETES SOTELO|GYSA ETCHOJOA' => 1118,
    'FLETES SOTELO|GYSA OBREGON 1' => 1021,
    'FLETES SOTELO|GYSA OBREGON 2' => 1021,
    'FLETES SOTELO|GYSA OBREGON PDC' => 1021,
    'FLETES SOTELO|HUNGAROS / NOGALES' => 600,
    'FLETES SOTELO|ARNPRIOR AEROSPACE CHIHUAHUA' => 375,
    'FLETES SOTELO|CESSNA PLANTA 4.1' => 375,
    'GYSA  CDJ|FLETES SOTELO' => 375,
    'GYSA  CDJ|YARDA SOTELO OBREGON' => 1021,
    'GYSA BACUM|GYSA NAVOJOA' => 112,
    'GYSA BACUM|GYSA OBREGON (CDO2)' => 45,
    'GYSA BACUM|GYSA OBREGON 2' => 45,
    'GYSA BACUM|GYSA OBREGON ODC' => 45,
    'GYSA BACUM|GYSA OBREGON PDC' => 45,
    'GYSA BACUM|YARDA SOTELO OBREGON' => 45,
    'GYSA ETCHOJOA|FLETES SOTELO' => 1118,
    'GYSA ETCHOJOA|GYSA  CDJ' => 1118,
    'GYSA ETCHOJOA|GYSA OBREGON ODC' => 97,
    'GYSA ETCHOJOA|GYSA OBREGON PDC' => 97,
    'GYSA JUAREZ JDC|GYSA OBREGON 2' => 1021,
    'GYSA NAVOJOA|GYSA OBREGON ODC' => 67,
    'GYSA NAVOJOA|GYSA OBREGON PDC' => 67,
    'GYSA NAVOJOA|YARDA SOTELO OBREGON' => 67,
    'GYSA OBREGON ODC|GYSA BACUM' => 45,
    'GYSA OBREGON ODC|GYSA ETCHOJOA' => 97,
    'GYSA OBREGON ODC|GYSA NAVOJOA' => 67,
    'GYSA OBREGON PDC|GYSA BACUM' => 45,
    'GYSA OBREGON PDC|GYSA ETCHOJOA' => 97,
    'GYSA OBREGON PDC|GYSA NAVOJOA' => 67,
    'COFICAB LEON, S. DE R.L. DE C.V. / PLANTA JUAREZ|TE CONNECTIVITY HERMOSILLO' => 800,
    'COFICAB LEON, S. DE R.L. DE C.V. / PLANTA JUAREZ|GYSA OBREGON PDC' => 1021,
    'TRANSERVICIOS CHIHUAHUA|TRANSERVICIOS CD JUAREZ' => 375,
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

    // 1. Exact client-named route table
    if (isset($ROUTE_DISTANCES_CLIENTS[$key])) {
        return (float)$ROUTE_DISTANCES_CLIENTS[$key];
    }

    // 2. Normalize to city names
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

    // 3. Pacifico city table
    $pac_org  = (strpos($org_norm,  'OBR') !== false) ? 'OBREGON' : $org_norm;
    $pac_dest = (strpos($dest_norm, 'OBR') !== false) ? 'OBREGON' : $dest_norm;
    $key_pac  = "$pac_org|$pac_dest";
    if (isset($ROUTE_DISTANCES_PACIFICO[$key_pac])) {
        return (float)$ROUTE_DISTANCES_PACIFICO[$key_pac];
    }

    // 4. Fallback to row kms from Genesis
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

function bundle_movements(array $rows): array {
    if (empty($rows)) return [];

    usort($rows, function ($a, $b) {
        $ta = parse_ts($a['Arranque'] ?? '');
        $tb = parse_ts($b['Arranque'] ?? '');
        return ($ta ?? 0) <=> ($tb ?? 0);
    });

    $trips       = [];
    $current     = [];

    foreach ($rows as $row) {
        $current[] = $row;
        $dest = strtoupper(trim($row['Destino'] ?? ''));
        $hub  = strpos($dest, 'JUAREZ')     !== false
             || strpos($dest, 'JRZ')        !== false
             || strpos($dest, 'BASE SOTELO') !== false
             || strpos($dest, 'EL PASO')    !== false
             || strpos($dest, 'PRECOS')      !== false;
        if ($hub) {
            $trips[] = $current;
            $current = [];
        }
    }
    if (!empty($current)) $trips[] = $current;
    return $trips;
}

function trip_timestamps(array $trip): array {
    $start = null;
    $end   = null;
    foreach ($trip as $row) {
        $ts = parse_ts($row['Arranque']       ?? '');
        $te = parse_ts($row['Arribo destino'] ?? '');
        if ($ts && ($start === null || $ts < $start)) $start = $ts;
        if ($te && ($end   === null || $te > $end))   $end   = $te;
    }
    return [$start, $end];
}

function calculate_chihuahua_payroll(array $trips, string $driver_name): array {
    global $UNIT_YIELDS;
    $entries = [];

    foreach ($trips as $i => $trip) {
        if (empty($trip)) continue;

        [$start_ts, $end_ts] = trip_timestamps($trip);
        $unit       = trim($trip[0]['Tractor'] ?? '');
        $unit_yield = $UNIT_YIELDS[$unit] ?? 2.37341;

        $base_pay    = 0.0;
        $leg_details = [];
        $legs_data   = [];

        // Pass 1: base pay per leg
        foreach ($trip as $row) {
            $origin   = strtoupper(trim($row['Origen']        ?? ''));
            $dest     = strtoupper(trim($row['Destino']       ?? ''));
            $status   = strtoupper(trim($row['Estatus flete'] ?? ''));
            $tipo     = strtoupper(trim($row['Tipo']          ?? ''));
            $coments  = strtoupper(trim($row['Comentarios']   ?? ''));

            $is_loaded = ($status === 'FACTURADO')
                      || in_array($tipo, ['IMP-02', 'EXP-02', 'FOR-02', 'MDC-01', 'TRI-02', 'TRE-02'], true);
            if (strpos($coments, 'VACIO') !== false
             || strpos($coments, 'VASIO') !== false
             || $status === 'COMPLETO'
             || $tipo   === 'PTT-00') {
                $is_loaded = false;
            }

            $rate      = $is_loaded ? 110.00 : 55.00;
            $base_pay += $rate;
            $leg_details[] = "{$origin}->{$dest} (\${$rate})";

            $raw_kms    = get_route_kms($origin, $dest, $row['Kms'] ?? 0);
            $legs_data[] = [
                'Origin'      => $origin,
                'Destination' => $dest,
                'Type'        => $tipo,
                'Status'      => $status,
                'Kms'         => (float)$raw_kms,
                'Is_Loaded'   => $is_loaded,
            ];
        }

        // Pass 2: diesel allowance with ELP deduction
        $total_kms_genesis  = 0.0;
        $total_kms_adjusted = 0.0;
        foreach ($trip as $row) {
            $origin  = strtoupper(trim($row['Origen']  ?? ''));
            $dest    = strtoupper(trim($row['Destino'] ?? ''));
            $raw_kms = get_route_kms($origin, $dest, $row['Kms'] ?? 0);

            $kms_adj = $raw_kms;
            if ((strpos($origin, 'RIO BRAVO') !== false || strpos($dest, 'RIO BRAVO') !== false
              || strpos($origin, 'EL PASO')   !== false || strpos($dest, 'EL PASO')   !== false
              || strpos($origin, 'ZARAGOZA')  !== false || strpos($dest, 'ZARAGOZA')  !== false)
             && $raw_kms > 50) {
                $kms_adj = max(0.0, $raw_kms - 40.0);
            }

            $total_kms_genesis  += $raw_kms;
            $total_kms_adjusted += $kms_adj;
        }

        $allowed_liters = $total_kms_adjusted / $unit_yield;

        $entries[] = [
            'id'                  => "{$driver_name}_{$i}_" . ($start_ts ?? 0),
            'Trip_ID'             => 'Trip_' . ($i + 1),
            'Driver'              => $driver_name,
            'Unit'                => $unit,
            'Start_Date'          => $start_ts ? date('Y-m-d H:i', $start_ts) : 'Unknown',
            'End_Date'            => $end_ts   ? date('Y-m-d H:i', $end_ts)   : 'In Progress',
            'Route'               => implode(' | ', $leg_details),
            'Total_Kms_Raw'       => (float)$total_kms_genesis,
            'Total_Kms_Paid'      => (float)$total_kms_adjusted,
            'Allowed_Liters'      => round((float)$allowed_liters, 2),
            'Yield_Used'          => (float)$unit_yield,
            'Base_Pay'            => (float)$base_pay,
            'Diesel_Rate'         => 14.85,
            'Manual_Refuel_Liters'=> 0.0,
            'Payroll_Week'        => get_payroll_week($start_ts),
            'Status'              => 'PENDING',
            'Is_Pacifico'         => false,
            'Manual_Pac_Loaded'   => false,
            'Manual_Pac_Bono_Sierra'     => false,
            'Manual_Pac_Bono_Doble'      => false,
            'Manual_Pac_Estancia_Obregon'=> 0,
            'Manual_Pac_Estancia_Mochis' => 0,
            'Legs'                => $legs_data,
        ];
    }
    return $entries;
}

function calculate_pacifico_payroll(array $trips, string $driver_name): array {
    global $UNIT_YIELDS;
    $entries = [];

    foreach ($trips as $i => $trip) {
        if (empty($trip)) continue;

        [$start_ts, $end_ts] = trip_timestamps($trip);
        $unit       = trim($trip[0]['Tractor'] ?? '');
        $unit_yield = $UNIT_YIELDS[$unit] ?? 2.37341;

        $leg_details = [];
        $legs_data   = [];
        $total_kms   = 0.0;

        foreach ($trip as $row) {
            $origin  = strtoupper(trim($row['Origen']        ?? ''));
            $dest    = strtoupper(trim($row['Destino']       ?? ''));
            $tipo    = strtoupper(trim($row['Tipo']          ?? ''));
            $status  = strtoupper(trim($row['Estatus flete'] ?? ''));

            $raw_kms    = get_route_kms($origin, $dest, $row['Kms'] ?? 0);
            $total_kms += $raw_kms;

            $leg_details[] = "{$origin}->{$dest} ({$raw_kms}km)";
            $legs_data[]   = [
                'Origin'      => $origin,
                'Destination' => $dest,
                'Type'        => $tipo,
                'Status'      => $status,
                'Kms'         => (float)$raw_kms,
                'Is_Loaded'   => true,
            ];
        }

        $allowed_liters = $total_kms / $unit_yield;

        $entries[] = [
            'id'                         => "{$driver_name}_{$i}_" . ($start_ts ?? 0),
            'Trip_ID'                    => 'Trip_' . ($i + 1),
            'Driver'                     => $driver_name,
            'Unit'                       => $unit,
            'Start_Date'                 => $start_ts ? date('Y-m-d H:i', $start_ts) : 'Unknown',
            'End_Date'                   => $end_ts   ? date('Y-m-d H:i', $end_ts)   : 'In Progress',
            'Route'                      => implode(' | ', $leg_details),
            'Total_Kms_Raw'              => (float)$total_kms,
            'Total_Kms_Paid'             => (float)$total_kms,
            'Allowed_Liters'             => round((float)$allowed_liters, 2),
            'Yield_Used'                 => (float)$unit_yield,
            'Base_Pay'                   => 0.0,
            'Diesel_Rate'                => 16.00,
            'Manual_Refuel_Liters'       => 0.0,
            'Payroll_Week'               => get_payroll_week($start_ts),
            'Status'                     => 'NEEDS_INPUT',
            'Is_Pacifico'                => true,
            'Manual_Pac_Loaded'          => false,
            'Manual_Pac_Bono_Sierra'     => false,
            'Manual_Pac_Bono_Doble'      => false,
            'Manual_Pac_Estancia_Obregon'=> 0,
            'Manual_Pac_Estancia_Mochis' => 0,
            'Legs'                       => $legs_data,
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

    // Group by driver
    $byDriver = [];
    foreach ($rows as $row) {
        $driver = trim($row['Conductor'] ?? '');
        if ($driver === '') continue;
        $byDriver[$driver][] = $row;
    }

    $results = [];
    foreach ($byDriver as $driver => $driverRows) {
        $trips = bundle_movements($driverRows);

        $is_pac = false;
        foreach ($trips as $trip) {
            foreach ($trip as $row) {
                if (is_pacifico_loc($row['Origen'] ?? '') || is_pacifico_loc($row['Destino'] ?? '')) {
                    $is_pac = true;
                    break 2;
                }
            }
        }

        $entries = $is_pac
            ? calculate_pacifico_payroll($trips, $driver)
            : calculate_chihuahua_payroll($trips, $driver);

        $results = array_merge($results, $entries);
    }

    echo json_encode(['trips' => $results]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['detail' => $e->getMessage()]);
}
