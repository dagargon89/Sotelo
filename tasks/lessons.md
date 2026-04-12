# Registro de Automejora y Lecciones Aprendidas (Sotelo PayrollTool)

Este documento registra patrones críticos detectados durante el desarrollo para evitar regresiones y errores reiterados.

## Principios Core (Orquestador Principal)
- **Simplicidad Primero:** No usar frameworks PHP externos; mantener la lógica stateless basada en CSV.
- **Impacto Mínimo:** Los cambios en el motor de cálculo no deben romper la compatibilidad con el CSV de Génesis.

## Lecciones Técnicas

### Gestión de Precios Diésel
- **Fallback Crítico:** Siempre usar el `Diesel_Rate` inyectado en `upload.php` como fallback si el operador no captura un precio real en `calculate.php`. No hardcodear precios en el frontend.

### Lógica de Kilometraje (Cruce)
- **Regla de 40 kms:** La deducción de cruce solo aplica si el kilometraje base es mayor o igual a 40.0. Verificar siempre los 6 ejes frontera especificados en el SOW.

### Robustez del Frontend (React)
- **Prevención de Crashes:** Validar siempre que `trips` existe antes de hacer `.map()`. Ante errores del API (como subir un archivo no CSV), lanzar alertas claras en lugar de dejar que React falle.

## Patrones de Desarrollo
- [ ] Implementar validación estricta de extensiones de archivo en el cliente y servidor.
- [ ] Mantener los componentes de UI (`TripCard.jsx`) desacoplados de la lógica de cálculo (delegar al API PHP).
