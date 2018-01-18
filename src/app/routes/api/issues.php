<?php

use Slim\Http\Request;
use Slim\Http\Response;

$app->get('/api/issues', function (Request $request, Response $response, array $args) {
    $this->logger->info("/api/issues");

    $state = $request->getParam('state');
    $client = new \Github\Client();

    switch ($state) {
        case 'closed':
            $issue_options = [
                'state' => 'closed'
            ];
            break;
        case 'open':
        default:
            $issue_options = [
                'state' => 'open'
            ];
            break;
    }

    $issues = $client
        ->api('issue')
        ->all(
            GITHUB_USERNAME,
            GITHUB_REPO_NAME,
            $issue_options
        )
    ;

    $json_response = $response->withJson($issues);

    return $json_response;
});

