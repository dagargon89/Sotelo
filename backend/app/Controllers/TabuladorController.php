<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\TabuladorModel;

class TabuladorController extends BaseController
{
    public function consultar()
    {
        $tipo = strtoupper((string) $this->request->getGet('tipo'));
        if ($tipo === '') {
            return $this->response->setStatusCode(400)->setJSON(['detail' => 'tipo es requerido']);
        }

        $cruce = strtoupper((string) $this->request->getGet('cruce'));
        $origen = strtoupper((string) $this->request->getGet('origen'));
        $destino = strtoupper((string) $this->request->getGet('destino'));

        $model = new TabuladorModel();
        $builder = $model->where('tipo', $tipo)->where('is_active', 1);

        if ($cruce !== '') {
            $builder->groupStart()->where('cruce', $cruce)->orWhere('cruce', null)->groupEnd();
        }
        if ($origen !== '') {
            $builder->groupStart()->where('origen', $origen)->orWhere('origen', null)->groupEnd();
        }
        if ($destino !== '') {
            $builder->groupStart()->where('destino', $destino)->orWhere('destino', null)->groupEnd();
        }

        $tarifa = $builder->orderBy('prioridad', 'DESC')->first();

        return $this->response->setJSON(['tarifa' => $tarifa]);
    }

    public function versiones()
    {
        $model = new TabuladorModel();
        $rows = $model->select('version, COUNT(*) as total')
            ->groupBy('version')
            ->orderBy('version', 'DESC')
            ->findAll();

        return $this->response->setJSON(['versiones' => $rows]);
    }

    public function upload()
    {
        return $this->response->setStatusCode(501)->setJSON([
            'detail' => 'Carga masiva de tabulador pendiente de implementacion.',
        ]);
    }

    public function activar()
    {
        $payload = $this->request->getJSON(true) ?? [];
        $version = (int) ($payload['version'] ?? 0);
        if ($version <= 0) {
            return $this->response->setStatusCode(400)->setJSON(['detail' => 'version invalida']);
        }

        $model = new TabuladorModel();
        $model->set('is_active', 0)->where('version !=', $version)->update();
        $model->set('is_active', 1)->where('version', $version)->update();

        return $this->response->setJSON(['ok' => true, 'version' => $version]);
    }
}
