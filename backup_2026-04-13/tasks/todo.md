# Backlog Global - Sotelo PayrollTool

## Fase 2: Reglas de Seguimiento y Proceso Semi-automático
Estado: `BLOQUEADO` para QA Final / Despliegue.

### Hito 1: Ajuste de Flujo Diésel y Nuevos Campos (DONE)
- [x] Retirar cálculo automático de incentivo en carga.
- [x] Incorporar captura manual de litros y precio real en `TripCard.jsx`.
- [x] Sincronizar `SummaryBar.jsx` con los cálculos del backend.
- [x] Implementar fallback de precio de referencia en `api/calculate.php`.

### Hito 2: Reglas de Negocio (DONE)
- [x] Implementar Bono Químico ($250) con toggle en frontend.
- [x] Implementar deducción de cruce internacional (-40 kms) en los 6 escenarios frontera.
- [x] Separación de precios diésel: $14.50 (Local/Cruce) vs $14.85 (Chihuahua).

### Hito 3: Catálogos y Estabilidad (DONE)
- [x] Actualizar `$UNIT_YIELDS` con 5 decimales.
- [x] Ampliar `$ROUTE_DISTANCES_CLIENTS` con rutas de seguimiento.
- [x] Actualizar clasificación de movimientos Génesis (series `-01`, `-02` vs `-00`).

---

## Próximos Pasos (QA y Despliegue)
- [ ] **Validación E2E:** Cargar `demo_data.csv` y verificar que el incentivo NO se calcule hasta la captura manual.
- [ ] **Prueba de Escenarios de Cruce:** Verificar que la deducción de 40 kms se aplique correctamente en los 6 ejes definidos.
- [ ] **Preparación de Deploy:** Consolidar bundle en `HOSTING_DEPLOY_READY` y configurar `api/.env` para producción.
- [ ] **Ejecución de Deploy:** Subida vía FTP a Site5.

---

## Futuro / Fase 3 (Propuesto)
- [ ] Persistencia de datos en MySQL (Historial de nóminas).
- [ ] Módulo de reportes de utilidad por flete/camión.
- [ ] Login y RBAC (Roles de Usuario).
