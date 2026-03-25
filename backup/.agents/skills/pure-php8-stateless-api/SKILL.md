---
name: pure-php8-stateless-api
description: Guidelines for building stateless API endpoints in pure PHP 8 without any frameworks or external libraries, suitable for shared hosting like cPanel.
---
# Pure PHP 8 Stateless API Skill

## Context
This skill is designed for legacy or restricted environments (like Site5 cPanel shared hosting) where modern PHP frameworks (Laravel, Symfony) or full-stack SSR tools cannot be used. 

## Architectural Rules
1.  **Zero Dependencies**: Do not use `composer.json` or external libraries unless strictly unavoidable. Use native PHP 8.x functions.
2.  **Stateless**: Do not use `$_SESSION` or expect memory persistence between requests.
3.  **JSON Only**: All endpoints must return `application/json` with proper UTF-8 charset.
4.  **CORS Handling**: Always respond to `OPTIONS` requests with early exit (200 OK) and include `Access-Control-Allow-Origin: *` (or specific domain) and `Access-Control-Allow-Methods` headers.

## Error Handling
- Never expose raw PHP stack traces. Use `try { ... } catch (Throwable $e) { ... }` blocks.
- Return HTTP 500 or 400 status codes appropriately with a `{"detail": "Error Message"}` JSON body.

## Code Structure (Per Endpoint)
- Disable basic display errors (e.g. `ini_set('display_errors', 0)`).
- Handle HTTP method checks explicitly at the top of the file.
- Decode `php://input` instead of relying entirely on `$_POST` for JSON payloads.
