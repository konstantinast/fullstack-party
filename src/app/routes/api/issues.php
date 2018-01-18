<?php

use Slim\Http\Request;
use Slim\Http\Response;

$app->get('/api/issues', function (Request $request, Response $response, array $args) {
    $this->logger->info("/api/issues");

    $state = $request->getParam('state');
    $page = (int)$request->getParam('page');
    $client = new \Github\Client();

    $params['page'] = !empty($page) ? $page : 1;
    $params['per_page'] = ISSUE_LIST_PER_PAGE_LIMIT;

    switch ($state) {
        case 'closed':
            $params['state'] = 'closed';
            break;
        case 'open':
        default:
            $params['state'] = 'open';
            break;
    }

    $api = $client->api('issue');

    $issues = $api
        ->all(
            GITHUB_USERNAME,
            GITHUB_REPO_NAME,
            $params
        )
    ;

    $json_response = $response->withJson($issues);

    return $json_response;
});