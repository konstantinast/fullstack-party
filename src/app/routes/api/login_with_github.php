<?php

use Slim\Http\Request;
use Slim\Http\Response;

$app->get('/api/login_with_github', function (Request $request, Response $response, array $args) {
    // Sample log message
    $this->logger->info("/api/login_with_github route");

    // Redirect user to Gihub App auth page
    $redir_url = GITHUB_APP_AUTH_URL_BASE . '?'
        . 'client_id=' . GITHUB_APP_CLIENT_ID
    ;

    return $response->withStatus(302)->withHeader('Location', $redir_url);
});