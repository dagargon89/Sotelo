---
name: genesis-csv-testing
description: Guidelines and scripts for validating the Sotelo pure PHP API against simulated Genesis CSV Data without relying on an actual database.
---
# Genesis CSV Testing Skill

## Context
The application processes exported CSV files from a corporate system named "Genesis". Because there is no database involved natively, testing must be completely stateless file-upload based.

## Approach
1. **Mock Files**: Do not test entirely with live/real data containing PII or sensitive corporate info. If real files must be used, redact driver names.
2. **Key Columns Required**: Every CSV you generate for testing the API must include the exact columns:
   `Conductor`, `Tractor`, `Arranque`, `Arribo destino`, `Origen`, `Destino`, `Kms`, `Estatus flete`, `Tipo`, `Comentarios`
3. **Endpoint Testing Framework**: Test against `api/upload.php` using simulated `multipart/form-data` requests via a custom lightweight PHP CLI test script or Node script utilizing `fetch`.

## Edge Cases to Validate
- Local Routes ("FLETES SOTELO", "GYSA JUAREZ JDC")
- "Pacifico" routes triggering specific yields and rules ("OBREGON", "MOCHIS")
- Vacant legs identified by the text `VACIO` or `VASIO` in the `Comentarios` column.
- ELP Deductions (`RIO BRAVO`, `EL PASO`).
