<?php

use Slim\Http\Request;
use Slim\Http\Response;

$app->get('/api/logout', function (Request $request, Response $response, array $args) {
    // Sample log message
    $this->logger->info("/api/logout route");

    unset($_SESSION['github_api_access_token']);

    $redir_url = '/';

    return $response->withStatus(302)->withHeader('Location', $redir_url);
});