<?php

use Slim\Http\Request;
use Slim\Http\Response;

$app->get('/api/issue/{number}', function (Request $request, Response $response, array $args) {
    $number = $args['number']; // internal number of issue in repo

    $this->logger->info("/api/issue/" . $number);

    $client = new \Github\Client();

    $issue = $client
        ->api('issue')
        ->comments()
        ->all(
            GITHUB_USERNAME,
            GITHUB_REPO_NAME,
            $number
        )
    ;

    $json_response = $response->withJson($issue);

    return $json_response;
});