<?php

use Slim\Http\Request;
use Slim\Http\Response;

$app->get('/api/issues', function (Request $request, Response $response, array $args) {
    $this->logger->info("/api/issues");

    $state = $request->getParam('state');
    $page = (int)$request->getParam('page');
    $client = new \Github\Client();
    $client->authenticate($_SESSION['github_api_access_token'], null, Github\Client::AUTH_HTTP_TOKEN);

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

    $query = '
        query {
            repository(owner:"KnpLabs", name:"php-github-api") {
                issues(states:CLOSED) {
                    totalCount
                }
            }
        }
    ';

    $repo_info_v4 = $client->api('graphql')->execute($query);

    $closed_issue_count = $repo_info_v4['data']['repository']['issues']['totalCount'];

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
            'closed' => $closed_issue_count
        ],
        'per_page' => $params['per_page'],
        'repo_info' => $repo_info
    ];

    $json_response = $response->withJson($data);

    return $json_response;
});