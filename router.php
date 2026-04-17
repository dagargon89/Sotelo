<?php
// PHP Built-in Server Router for Sotelo Project

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

if (strpos($uri, '/api/') === 0) {
    $_SERVER['SCRIPT_NAME'] = '/index.php';
    require __DIR__ . '/backend/public/index.php';
    exit;
}

// Serve existing files
if ($uri !== '/' && file_exists(__DIR__ . $uri)) {
    return false;
}

// SPA Fallback: serve index.html for all other routes
require __DIR__ . '/index.html';
