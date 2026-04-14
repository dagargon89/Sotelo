<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

$routes->options('api/(:any)', static function () {
	return service('response')->setStatusCode(204);
});

$routes->group('api', static function (RouteCollection $routes): void {
	$routes->post('upload', 'UploadController::process');
	$routes->post('calculate', 'CalculateController::recalculate');

	$routes->get('catalogs/rendimientos', 'CatalogController::rendimientos');
	$routes->get('catalogs/rutas', 'CatalogController::rutas');
	$routes->get('catalogs/keywords', 'CatalogController::keywords');

	$routes->get('tabulador', 'TabuladorController::consultar');
	$routes->get('tabulador/versiones', 'TabuladorController::versiones');
	$routes->post('tabulador/upload', 'TabuladorController::upload');
	$routes->post('tabulador/activar', 'TabuladorController::activar');

	$routes->get('sessions/pending', 'SessionController::pending');
	$routes->post('sessions/save', 'SessionController::save');
	$routes->post('sessions/restore', 'SessionController::restore');
});
