## Admin: Sección administrativa (CRUD)

TL;DR: Crear un módulo administrativo sencillo (sin autenticación) que exponga CRUD REST y una UI mínima para gestionar las tablas mutables: `unidades_rendimiento`, `rutas_distancias`, `pacifico_keywords`, `tabulador_tarifas` y lectura de `audit_logs`/`liquidaciones_temporales`.

**Pasos**
1. Backend — Endpoints REST (CI4):
   - `GET /api/admin/unidades` — listar (paginado opcional)
   - `GET /api/admin/unidades/{id}` — leer
   - `POST /api/admin/unidades` — crear
   - `PUT /api/admin/unidades/{id}` — actualizar
   - `DELETE /api/admin/unidades/{id}` — baja lógica (`is_active=0`)
   - Repetir patrón para `rutas`, `keywords`, `tabulador`.
   - `GET /api/admin/audit_logs` — listar (solo lectura).
   - `GET /api/admin/liquidaciones` — listar sesiones temporales (solo lectura/descarga JSON).

2. Backend — Controladores y modelos:
   - Crear `backend/app/Controllers/Admin/*Controller.php` (UnidadesController, RutasController, KeywordsController, TabuladorController, AuditController, LiquidacionController).
   - Reutilizar `UnidadModel`, `RutaModel`, `TabuladorModel`, `AuditLogModel`, `LiquidacionModel` con campos `allowedFields` apropiados y validaciones básicas en los controladores.
   - Añadir reglas de validación (CI4 Validation) por campo (ej.: `tractor` único, `distancia_km` numérico positivo).

3. Backend — Rutas:
   - Añadir grupo `api/admin` en `app/Config/Routes.php` con rutas REST y permitir `OPTIONS` (preflight ya enrutado globalmente).

4. Frontend — UI mínima (React/Vite):
   - Nueva ruta SPA `/admin` con subpáginas:
     - `/admin/unidades` — tabla + modal crear/editar + acciones activar/desactivar
     - `/admin/rutas` — tabla con filtros por región + modal crear/editar
     - `/admin/keywords` — lista simple + añadir/borrar
     - `/admin/tabulador` — tabla con búsqueda por `tipo` y formularios para crear/editar filas
     - `/admin/audit` — visor read-only (filtro por acción, fecha)
   - Reutilizar `frontend/src/api.js` añadiendo métodos: `adminFetchUnidades`, `adminCreateUnidad`, `adminUpdateUnidad`, `adminDeleteUnidad`, etc.
   - Componentes propuestos: `AdminLayout.jsx`, `ResourceTable.jsx` (genérico), `UnidadForm.jsx`, `RutaForm.jsx`, `TabuladorForm.jsx`.

5. Frontend — UX/validaciones:
   - Validaciones básicas en formularios (requeridos, tipos numéricos).
   - Confirmaciones para borrado (soft-delete).
   - Paginar o lazy-load si >200 filas.

6. Testing y verificación:
   - Pruebas manuales: crear → editar → desactivar → listar para cada recurso.
   - Curl smoke tests para cada endpoint (200/201/204 esperados).

**Archivos a crear/modificar**
- `backend/app/Controllers/Admin/UnidadesController.php` (y análogos para Rutas/Keywords/Tabulador/Audit/Liquidacion)
- `backend/app/Config/Routes.php` (añadir grupo `api/admin`)
- `frontend/src/pages/admin/*` — `AdminLayout.jsx`, `UnidadesPage.jsx`, `RutasPage.jsx`, `KeywordsPage.jsx`, `TabuladorPage.jsx`, `AuditPage.jsx`
- `frontend/src/api.js` — métodos `admin*`

**Verificación**
1. Backend: `curl -i POST /api/admin/unidades` con JSON válido → 201 y vuelta de recurso con id.
2. Frontend: navegar a `/admin/unidades`, crear unidad y verificar que aparece en la tabla.
3. Repetir para rutas/keywords/tabulador.

**Decisiones / Supuestos**
- No se implementa autenticación ni RBAC (el usuario lo pidió explícitamente).
- Los deletes serán baja lógica (`is_active=0`) salvo que se indique lo contrario.
- `audit_logs` será solo lectura desde admin (no permitir escritura manual desde UI).

**Consideraciones futuras (opcional)**
1. Añadir paginación y filtros server-side para tablas grandes.
2. Añadir confirmación de cambios en `tabulador` mediante versionado (crear nueva versión en vez de sobrescribir).
3. Agregar autenticación (JWT/Session) para producción.
