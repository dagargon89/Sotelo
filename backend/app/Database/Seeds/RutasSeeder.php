<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class RutasSeeder extends Seeder
{
    public function run()
    {
        $rows = [
            ['origen_normalizado' => 'JUAREZ', 'destino_normalizado' => 'CHIHUAHUA', 'distancia_km' => 375, 'region' => 'GENERAL', 'is_active' => 1],
            ['origen_normalizado' => 'CHIHUAHUA', 'destino_normalizado' => 'JUAREZ', 'distancia_km' => 375, 'region' => 'GENERAL', 'is_active' => 1],
            ['origen_normalizado' => 'EL PASO', 'destino_normalizado' => 'CHIHUAHUA', 'distancia_km' => 415, 'region' => 'GENERAL', 'is_active' => 1],
            ['origen_normalizado' => 'CHIHUAHUA', 'destino_normalizado' => 'EL PASO', 'distancia_km' => 415, 'region' => 'GENERAL', 'is_active' => 1],
            ['origen_normalizado' => 'PRECOS', 'destino_normalizado' => 'CHIHUAHUA', 'distancia_km' => 360, 'region' => 'GENERAL', 'is_active' => 1],
            ['origen_normalizado' => 'CHIHUAHUA', 'destino_normalizado' => 'PRECOS', 'distancia_km' => 360, 'region' => 'GENERAL', 'is_active' => 1],

            ['origen_normalizado' => 'JUAREZ', 'destino_normalizado' => 'OBREGON', 'distancia_km' => 1021, 'region' => 'PACIFICO', 'is_active' => 1],
            ['origen_normalizado' => 'OBREGON', 'destino_normalizado' => 'JUAREZ', 'distancia_km' => 1021, 'region' => 'PACIFICO', 'is_active' => 1],
            ['origen_normalizado' => 'JUAREZ', 'destino_normalizado' => 'GUAMUCHIL', 'distancia_km' => 1330, 'region' => 'PACIFICO', 'is_active' => 1],
            ['origen_normalizado' => 'GUAMUCHIL', 'destino_normalizado' => 'JUAREZ', 'distancia_km' => 1330, 'region' => 'PACIFICO', 'is_active' => 1],
            ['origen_normalizado' => 'CHIHUAHUA', 'destino_normalizado' => 'OBREGON', 'distancia_km' => 1131, 'region' => 'PACIFICO', 'is_active' => 1],
            ['origen_normalizado' => 'OBREGON', 'destino_normalizado' => 'CHIHUAHUA', 'distancia_km' => 1131, 'region' => 'PACIFICO', 'is_active' => 1],
            ['origen_normalizado' => 'MOCHIS', 'destino_normalizado' => 'OBREGON', 'distancia_km' => 232, 'region' => 'PACIFICO', 'is_active' => 1],
            ['origen_normalizado' => 'OBREGON', 'destino_normalizado' => 'MOCHIS', 'distancia_km' => 232, 'region' => 'PACIFICO', 'is_active' => 1],

            ['origen_normalizado' => 'ATLAS AEROSPACE', 'destino_normalizado' => 'FLETES SOTELO', 'distancia_km' => 375, 'region' => 'CLIENTE', 'is_active' => 1],
            ['origen_normalizado' => 'ATLAS AEROSPACE', 'destino_normalizado' => 'PRECOS ZARAGOZA', 'distancia_km' => 375, 'region' => 'CLIENTE', 'is_active' => 1],
            ['origen_normalizado' => 'FLETES SOTELO', 'destino_normalizado' => 'YARDA SOTELO OBREGON', 'distancia_km' => 1021, 'region' => 'CLIENTE', 'is_active' => 1],
            ['origen_normalizado' => 'GYSA BACUM', 'destino_normalizado' => 'YARDA SOTELO OBREGON', 'distancia_km' => 45, 'region' => 'CLIENTE', 'is_active' => 1],
            ['origen_normalizado' => 'GYSA ETCHOJOA', 'destino_normalizado' => 'GYSA OBREGON ODC', 'distancia_km' => 97, 'region' => 'CLIENTE', 'is_active' => 1],
            ['origen_normalizado' => 'GYSA NAVOJOA', 'destino_normalizado' => 'GYSA OBREGON PDC', 'distancia_km' => 67, 'region' => 'CLIENTE', 'is_active' => 1],
            ['origen_normalizado' => 'FLETES SOTELO', 'destino_normalizado' => 'GYSA ASCENCION', 'distancia_km' => 200, 'region' => 'CLIENTE', 'is_active' => 1],
            ['origen_normalizado' => 'BASE SOTELO CHIHUAHUA', 'destino_normalizado' => 'CASETA DE VILLA AHUMADA', 'distancia_km' => 130, 'region' => 'CLIENTE', 'is_active' => 1],
        ];

        $this->db->table('rutas_distancias')->insertBatch($rows);
    }
}
