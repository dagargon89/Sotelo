Voy a leer los archivos clave del proyecto actual para enriquecer el plan con detalles técnicos precisos sobre cada función, constante y flujo que debe migrarse.    

Leer [](file:///home/dagargon89/Sotelo/frontend/src/constants.js)

Leer [](file:///home/dagargon89/Sotelo/frontend/src/api.js)

Leer [](file:///home/dagargon89/Sotelo/api/upload.php#1-1), líneas 1 a 150

Leer [](file:///home/dagargon89/Sotelo/router.php)

Leer [](file:///home/dagargon89/Sotelo/api/upload.php#150-150), líneas 150 a 400

Leer [](file:///home/dagargon89/Sotelo/frontend/src/App.jsx)

Leer [](file:///home/dagargon89/Sotelo/api/calculate.php#1-1), líneas 1 a 100

Leer [](file:///home/dagargon89/Sotelo/api/upload.php#400-400), líneas 400 a 532

Leer [](file:///home/dagargon89/Sotelo/api/calculate.php#100-100), líneas 100 a 140

Ahora leo los componentes frontend para mapear toda la funcionalidad visual.  

Analyze frontend components

Read project documentation

Leer [](file:///home/dagargon89/Sotelo/importante/handover-tecnico.md)

Leer [](file:///home/dagargon89/Sotelo/importante/estado_actual_app.md)

Leer [](file:///home/dagargon89/Sotelo/importante/guideline-mvp.md)

Leer [](file:///home/dagargon89/Sotelo/importante/sow.md)

Leer [](file:///home/dagargon89/Sotelo/importante/reporte-cruces.md)

Leer [](file:///home/dagargon89/Sotelo/PLAN_IMPLEMENTACION_CRUCES.md)

Leer [](file:///home/dagargon89/Sotelo/frontend/src/components/DashboardKPIs.jsx)

Leer [](file:///home/dagargon89/Sotelo/frontend/src/components/FileUpload.jsx)

Leer [](file:///home/dagargon89/Sotelo/frontend/src/components/SummaryBar.jsx)

Leer [](file:///home/dagargon89/Sotelo/frontend/src/components/BoletaCard.jsx#1-1), líneas 1 a 150

Leer [](file:///home/dagargon89/Sotelo/frontend/src/components/PeriodSelector.jsx)

Leer [](file:///home/dagargon89/Sotelo/frontend/src/components/TripList.jsx)

Leer [](file:///home/dagargon89/Sotelo/frontend/src/components/TripCard.jsx#1-1), líneas 1 a 150

Leer [](file:///home/dagargon89/Sotelo/frontend/package.json)

Leer [](file:///home/dagargon89/Sotelo/frontend/src/utils/exportExcel.js#1-1), líneas 1 a 150

Leer [](file:///home/dagargon89/Sotelo/frontend/src/components/TripCard.jsx#150-150), líneas 150 a 300

Leer [](file:///home/dagargon89/Sotelo/frontend/src/utils/exportExcel.js#150-150), líneas 150 a 170

Leer [](file:///home/dagargon89/Sotelo/frontend/src/App.jsx)

Leer [](file:///home/dagargon89/.vscode-server/data/User/workspaceStorage/4f5b3e7f281d3781897f850f826d6ad5/GitHub.copilot-chat/chat-session-resources/9e833bc8-0972-4680-a310-21447ce80631/toolu_bdrk_01WD3nrEntN5shdD5NVRUX42__vscode-1776187444877/content.txt#1-1), líneas 1 a 200

Leer [](file:///home/dagargon89/.vscode-server/data/User/workspaceStorage/4f5b3e7f281d3781897f850f826d6ad5/GitHub.copilot-chat/chat-session-resources/9e833bc8-0972-4680-a310-21447ce80631/toolu_bdrk_01He8DikWSMcHBU8x6DtZJBA__vscode-1776187444878/content.txt)

Tengo toda la información necesaria. Ahora voy a reescribir el plan con un nivel de detalle mucho mayor, cubriendo cada función, tabla, endpoint, componente y decisión técnica. 

Memoria eliminada[](file:///home/dagargon89/.vscode-server/data/User/workspaceStorage/4f5b3e7f281d3781897f850f826d6ad5/GitHub.copilot-chat/memory-tool/memories/OWU4MzNiYzgtMDk3Mi00NjgwLWEzMTAtMjE0NDdjZTgwNjMx/plan.md)

Archivo de memoria creado[](file:///home/dagargon89/.vscode-server/data/User/workspaceStorage/4f5b3e7f281d3781897f850f826d6ad5/GitHub.copilot-chat/memory-tool/memories/OWU4MzNiYzgtMDk3Mi00NjgwLWEzMTAtMjE0NDdjZTgwNjMx/plan.md)

El plan detallado está guardado en `/memories/session/plan.md`. Aquí está el resumen ejecutivo:

---

## Plan Detallado: Migración a CodeIgniter 4 + MySQL

### Premisa
Se elimina toda la estructura actual (excepto backups y frontend) y se reconstruye desde cero con **CodeIgniter 4**. El respaldo se usa como referencia línea por línea para no perder funcionalidad.

---

### Inventario del código actual (qué se migra)

**Backend (upload.php ~530 líneas + calculate.php ~140 líneas):**
- 56 tractores en `$UNIT_YIELDS` (5 grupos de rendimiento)
- ~176 rutas en 3 tablas: GENERAL (6), PACÍFICO (~50), CLIENTE (~120)
- 15 keywords de detección Pacífico
- 5 funciones helper: `is_pacifico_loc()`, `get_route_kms()`, `parse_ts()`, `get_payroll_week()`, `process_by_boleta()`
- Lógica de cruce fronterizo (deducción 40km), diesel rates (14.50/14.85/16.00), bonos Pacífico, bono químico

**Frontend (8 componentes React):**
- App.jsx, `FileUpload`, `PeriodSelector`, `DashboardKPIs`, `TripList`, `BoletaCard`, `TripCard`, `SummaryBar`
- constants.js (duplicado de yields — se eliminará)
- `exportExcel.js` (exceljs + file-saver)

---

### Nueva estructura

```
Sotelo/
├── backups/                          # NO TOCAR
├── backend/                          # CodeIgniter 4
│   ├── app/Controllers/              # 5 controladores
│   │   ├── UploadController.php      # ← upload.php
│   │   ├── CalculateController.php   # ← calculate.php
│   │   ├── CatalogController.php     # rendimientos, rutas, keywords
│   │   ├── TabuladorController.php   # motor de tarifas
│   │   └── SessionController.php     # persistencia temporal
│   ├── app/Libraries/                # 5 servicios de negocio
│   │   ├── CsvParser.php             # parsing CSV
│   │   ├── RouteResolver.php         # get_route_kms() con caché RAM
│   │   ├── PacificoDetector.php      # is_pacifico_loc()
│   │   ├── BoletaProcessor.php       # process_by_boleta()
│   │   └── PayrollCalculator.php     # calculate.php lógica
│   ├── app/Models/                   # 5 modelos
│   ├── app/Database/Migrations/      # 6 migraciones
│   └── app/Database/Seeds/           # 3 seeders
└── frontend/                         # React 19 (se conserva y adapta)
```

---

### Base de datos — 6 tablas

| Tabla | Registros iniciales | Propósito |
|-------|:---:|---------|
| `unidades_rendimiento` | 56 | Rendimientos por tractor |
| `rutas_distancias` | ~176 | Distancias con columna `region` (GENERAL/PACIFICO/CLIENTE) |
| `pacifico_keywords` | 15 | Keywords de detección zona |
| `tabulador_tarifas` | 0 (fase futura) | Motor de tarifas versionado |
| `liquidaciones_temporales` | 0 | Persistencia de sesión UI |
| `audit_logs` | 0 | Trazabilidad |

---

### Endpoints API (12 rutas)

| Método | Ruta | Origen |
|--------|------|--------|
| POST | `/api/upload` | ← upload.php |
| POST | `/api/calculate` | ← calculate.php |
| GET | `/api/catalogs/rendimientos` | Nuevo |
| GET | `/api/catalogs/rutas` | Nuevo |
| GET | `/api/catalogs/keywords` | Nuevo |
| GET | `/api/tabulador` | Nuevo |
| POST | `/api/tabulador/upload` | Nuevo |
| GET | `/api/tabulador/versiones` | Nuevo |
| POST | `/api/tabulador/activar` | Nuevo |
| GET | `/api/sessions/pending` | Nuevo |
| POST | `/api/sessions/save` | Nuevo |
| POST | `/api/sessions/restore` | Nuevo |

---

### 10 fases de ejecución

| Fase | Qué | Duración est. |
|:---:|------|:---:|
| 0 | Verificar entorno PHP/MySQL, instalar CI4 | 0.5 día |
| 1 | Eliminar estructura obsoleta (con backup verificado) | 0.5 día |
| 2 | Migraciones + Seeds (6 tablas, 247 registros) | 1 día |
| 3 | Libraries core (5 servicios de negocio) | 2 días |
| 4 | Controladores (5) + CORS + Routes | 1.5 días |
| 5 | Integración Frontend (api.js, App.jsx, Cards) | 1 día |
| 6 | Motor de Tarifas (tabulador versionado) | 1.5 días |
| 7 | Persistencia de sesión + Auditoría | 0.5 día |
| 8 | Testing final + documentación | 1 día |

---

### Checklist de equivalencia funcional (32 verificaciones)

El plan incluye un checklist exhaustivo que cubre desde la detección de encoding hasta cada regla de negocio (deducción cruce 40km, bonos Pacífico, diesel rates, normalización de nombres), con un script de comparación JSON que ejecuta el mismo CSV contra ambos backends y compara campo por campo.

---

### Archivos a eliminar (cubiertos por backup)
api, router.php, tmp.php, out.txt, index.html (raíz), assets, mockup_nomina.html, `este es el bueno`

### Archivos que se conservan
backups, frontend, importante, tasks, CSVs de prueba (se mueven a `backend/tests/fixtures/`)

---

