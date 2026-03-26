<?php
// PHP Built-in Server Router for Sotelo Project

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

// Map clean API URLs to PHP files
if ($uri === '/api/upload') {
    require __DIR__ . '/api/upload.php';
    exit;
}
if ($uri === '/api/calculate') {
    require __DIR__ . '/api/calculate.php';
    exit;
}

// Serve existing files
if ($uri !== '/' && file_exists(__DIR__ . $uri)) {
    return false;
}

// SPA Fallback: serve index.html for all other routes
require __DIR__ . '/index.html';
