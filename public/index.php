<?php
if (PHP_SAPI == 'cli-server') {
    // To help the built-in PHP dev server, check if the request was actually for
    // something which should probably be served as a static file
    $url  = parse_url($_SERVER['REQUEST_URI']);
    $file = __DIR__ . $url['path'];
    if (is_file($file)) {
        return false;
    }
}

// Resolve some paths
$backpath_prefix = '/..';

require __DIR__ . '/../vendor/autoload.php';

session_start();

// Instantiate the app
$settings = require __DIR__ . $backpath_prefix . '/src/settings.php';
$app = new \Slim\App($settings);

// Load constants
require __DIR__ . $backpath_prefix . '/src/constants.php';

// Set up dependencies
require __DIR__ . $backpath_prefix . '/src/dependencies.php';

// Register middleware
require __DIR__ . $backpath_prefix . '/src/middleware.php';

// Register routes
require __DIR__ . $backpath_prefix . '/src/routes.php';

// Run app
$app->run();
