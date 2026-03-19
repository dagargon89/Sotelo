<?php
ini_set('display_errors', 0);

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

try {
    $body = file_get_contents('php://input');
    $data = json_decode($body, true);

    if (!$data || !isset($data['trips']) || !is_array($data['trips'])) {
        http_response_code(400);
        echo json_encode(['detail' => 'Request body invalido. Se esperaba {trips: [...]}']);
        exit;
    }

    $updated = [];

    foreach ($data['trips'] as $trip) {
        $is_pac     = (bool)($trip['Is_Pacifico']          ?? false);
        $allowed    = (float)($trip['Allowed_Liters']       ?? 0);
        $refueled   = (float)($trip['Manual_Refuel_Liters'] ?? 0);
        $rate       = (float)($trip['Diesel_Rate']          ?? 0);
        $kms_paid   = (float)($trip['Total_Kms_Paid']       ?? 0);

        $savings  = max(0.0, $allowed - $refueled);
        $incentive = $savings * $rate;

        if ($is_pac) {
            $pac_rate  = ($trip['Manual_Pac_Loaded'] ?? false) ? 0.30 : 0.15;
            $base_pay  = $kms_paid * $pac_rate;

            $bonuses = 0.0;
            if ($trip['Manual_Pac_Bono_Sierra'] ?? false) $bonuses += 500.0;
            if ($trip['Manual_Pac_Bono_Doble']  ?? false) $bonuses += 1726.0;
            $bonuses += (int)($trip['Manual_Pac_Estancia_Obregon'] ?? 0) * 600.0;
            $bonuses += (int)($trip['Manual_Pac_Estancia_Mochis']  ?? 0) * 300.0;

            $total_pay       = $base_pay + $bonuses + $incentive;
            $trip['Base_Pay'] = $base_pay;

            if (($trip['Status'] ?? '') === 'NEEDS_INPUT') {
                $trip['Status'] = 'PENDING';
            }
        } else {
            $total_pay = (float)($trip['Base_Pay'] ?? 0) + $incentive;
        }

        $trip['Diesel_Savings'] = $savings;
        $trip['Incentive_Pay']  = $incentive;
        $trip['Total_Pay']      = $total_pay;

        $updated[] = $trip;
    }

    echo json_encode(['trips' => $updated]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['detail' => $e->getMessage()]);
}
