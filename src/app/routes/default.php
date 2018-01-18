<?php

use Slim\Http\Request;
use Slim\Http\Response;

// Catch anything that falls through to this and redirect to index
// This is needed for html5 mode one page app (angular) to work
$app->get('/[{params:.*}]', function (Request $request, Response $response, array $args) {
    $this->logger->info("default route");

    // Render index view
    return $this->renderer->render($response, 'default.phtml', $args);
});