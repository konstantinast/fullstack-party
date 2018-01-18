<?php

use Slim\Http\Request;
use Slim\Http\Response;

$app->get('/[{name}]', function (Request $request, Response $response, array $args) {
    $this->logger->info("Slim-Skeleton '/' route");

    // Render index view
    return $this->renderer->render($response, 'index.phtml', $args);
});