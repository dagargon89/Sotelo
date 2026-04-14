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
        $is_pac   = (bool)($trip['Is_Pacifico'] ?? false);
        $kms_paid = (float)($trip['Total_Kms_Paid'] ?? 0);
        $rate     = (float)($trip['Diesel_Rate'] ?? 0);

        $bono_quimico_val = (bool)($trip['Manual_Bono_Quimico'] ?? false) ? 250.0 : 0.0;

        // -------------------------------------------------------
        // Modo Boleta (nuevo): sumar incentivo de cada fila (Rows)
        // -------------------------------------------------------
        if (!empty($trip['Rows']) && is_array($trip['Rows'])) {

            $total_incentive   = 0.0;
            $total_kms         = 0.0;
            $total_base_pay    = 0.0;
            $total_recarga     = 0.0;
            $total_litros_pago = 0.0;

            foreach ($trip['Rows'] as $row) {
                $diesel_a_favor = (float)($row['Diesel_A_Favor'] ?? 0);
                $recarga        = (float)($row['Recarga']        ?? 0);
                $litros_a_pago  = (float)($row['Litros_A_Pago']  ?? 0);
                $pago_km        = (float)($row['Pago_Por_Km']    ?? 0);
                $kms            = (float)($row['Kms']            ?? 0);

                $total_incentive   += max(0.0, $diesel_a_favor);
                $total_recarga     += $recarga;
                $total_litros_pago += $litros_a_pago;
                $total_kms         += $kms;
                $total_base_pay    += $pago_km;
            }

            $savings = $total_litros_pago - $total_recarga;

            // Pacifico Boleta
            if ($is_pac) {
                $pac_rate = ($trip['Manual_Pac_Loaded'] ?? false) ? 0.30 : 0.15;
                $base_pay = $kms_paid > 0 ? $kms_paid * $pac_rate : $total_kms * $pac_rate;

                $bonuses = 0.0;
                if ($trip['Manual_Pac_Bono_Sierra'] ?? false) $bonuses += 500.0;
                if ($trip['Manual_Pac_Bono_Doble']  ?? false) $bonuses += 1726.0;
                $bonuses += (int)($trip['Manual_Pac_Estancia_Obregon'] ?? 0) * 600.0;
                $bonuses += (int)($trip['Manual_Pac_Estancia_Mochis']  ?? 0) * 300.0;

                $trip['Base_Pay']   = $base_pay;
                $total_pay          = $base_pay + $bonuses + $total_incentive + $bono_quimico_val;
            } else {
                // Chihuahua Boleta
                $base_pay = $total_base_pay > 0 ? $total_base_pay : (float)($trip['Base_Pay'] ?? 0);
                $trip['Base_Pay'] = $base_pay;
                $total_pay        = $base_pay + $total_incentive + $bono_quimico_val;
            }

            // Update global trip fields from row totals
            $trip['Manual_Refuel_Liters'] = $total_recarga;
            $trip['Allowed_Liters']       = round($total_litros_pago, 2);
            $trip['Diesel_Savings']       = round($savings, 2);
            $trip['Incentive_Pay']        = round($total_incentive, 2);
            $trip['Total_Pay']            = round($total_pay, 2);

        } else {
            // -------------------------------------------------------
            // Modo clásico (legado): usar campos globales del trip
            // -------------------------------------------------------
            $allowed      = (float)($trip['Allowed_Liters']       ?? 0);
            $refueled     = (float)($trip['Manual_Refuel_Liters'] ?? 0);
            $manual_price = (float)($trip['Manual_Actual_Price_Per_Liter'] ?? 0);
            $effective_rate = $manual_price > 0 ? $manual_price : $rate;

            $savings   = max(0.0, $allowed - $refueled);
            $incentive = $savings * $effective_rate;

            if ($is_pac) {
                $pac_rate = ($trip['Manual_Pac_Loaded'] ?? false) ? 0.30 : 0.15;
                $base_pay = $kms_paid * $pac_rate;

                $bonuses = 0.0;
                if ($trip['Manual_Pac_Bono_Sierra'] ?? false) $bonuses += 500.0;
                if ($trip['Manual_Pac_Bono_Doble']  ?? false) $bonuses += 1726.0;
                $bonuses += (int)($trip['Manual_Pac_Estancia_Obregon'] ?? 0) * 600.0;
                $bonuses += (int)($trip['Manual_Pac_Estancia_Mochis']  ?? 0) * 300.0;

                $trip['Base_Pay'] = $base_pay;
                $total_pay        = $base_pay + $bonuses + $incentive + $bono_quimico_val;
            } else {
                $total_pay = (float)($trip['Base_Pay'] ?? 0) + $incentive + $bono_quimico_val;
            }

            $trip['Diesel_Savings'] = round($savings, 2);
            $trip['Incentive_Pay']  = round($incentive, 2);
            $trip['Total_Pay']      = round($total_pay, 2);
        }

        // Update status
        if (($trip['Status'] ?? '') === 'NEEDS_INPUT') {
            $trip['Status'] = 'PENDING';
        }

        $updated[] = $trip;
    }

    echo json_encode(['trips' => $updated]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['detail' => $e->getMessage()]);
}
