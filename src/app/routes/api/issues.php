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

    $repo_api = $client->api('repo');

    $repo_info = $repo_api
        ->show(
            GITHUB_USERNAME,
            GITHUB_REPO_NAME
        )
    ;

    // --- Get closed issue count --*
    // SADLY this is not really possible without the use of
    // Github v4 API (a.k.a. GraphQL API), which can only be
    // accessed after authentification with Github account
    // SO until user authentification is not implemented
    // this count cannot be retrieved via single call
    // (by that I mean, that we can always poll api by narrowing intervals
    // but that is a a sure way to get banned) :D

    $issue_api = $client->api('issue');

    $issues = $issue_api
        ->all(
            GITHUB_USERNAME,
            GITHUB_REPO_NAME,
            $params
        )
    ;

    $data = [
        'issues' => $issues,
        'count' => [
            'open' => $repo_info['open_issues'],
            'closed' => $repo_info['closed_issues']
        ],
        'per_page' => $params['per_page'],
        'repo_info' => $repo_info
    ];

    $json_response = $response->withJson($data);

    return $json_response;
});