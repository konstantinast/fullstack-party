<?php
// Application middleware

// e.g: $app->add(new \Slim\Csrf\Guard);

use Slim\Http\Request;
use Slim\Http\Response;

// Adding x-secret header to make sure front-end, that a user has non-expired access token
$app->add(function (Request $request, Response $response, $next) {
    $path = $request->getUri()->getPath();

    $include_pattern = '/\/api\/.*/';
    $exclude_pattern = '/\/api\/login.*/';

    if (
        preg_match($include_pattern, $path)
        &&
        !preg_match($exclude_pattern, $path)
    ) {
        if (empty($_SESSION['github_api_access_token'])) {
            return $response->withStatus(401);
        }
    }

    return $next($request, $response);
});