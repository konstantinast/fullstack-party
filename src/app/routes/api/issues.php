<?php

use Slim\Http\Request;
use Slim\Http\Response;

$app->get('/api/issues', function (Request $request, Response $response, array $args) {
    $this->logger->info("/api/issues");

    $allowed_states = [
        'open',
        'closed'
    ];

    $state = $request->getParam('state');
    $page_raw = (int)$request->getParam('page');

    try {
        $client = new \Github\Client();
        $client->authenticate($_SESSION['github_api_access_token'], null, Github\Client::AUTH_HTTP_TOKEN);

        $current_user = $client->currentUser();
        $current_user_info = $current_user->show();
    } catch (Exception $exc) {
        return $response->withStatus(401);
    }

    $page = !empty($page_raw) ? $page_raw : 1;
    $per_page = ISSUE_LIST_PER_PAGE_LIMIT;

    $params = [
        'is:issue',
        'assignee:'.$current_user_info['login'],
        'archived:false'
    ];

    $search_api = $client->api('search');
    $search_api->setPage($page);
    $search_api->setPerPage($per_page);

    foreach ($allowed_states as $allowed_state) {
        $query = implode(' ', array_merge($params, ['is:' . $allowed_state]));

        $api_reponse[$allowed_state] = $search_api->issues($query);
    }

    $selected_state = strtolower($state);

    $issues = $api_reponse[$selected_state]['items'];

    // Extract info
    $matches = [];

    foreach ($issues as & $issue) {
        preg_match("/\/repos\/(.*)\/(.*)(?:\/){0,1}/", $issue['repository_url'], $matches);

        $repo_owner = $matches[1];
        $repo_name = $matches[2];

        $issue['repo_owner'] = $repo_owner;
        $issue['repo_name'] = $repo_name;
    }

    $data = [
        'issues' => $issues,
        'count' => [
            'open' => $api_reponse['open']['total_count'],
            'closed' => $api_reponse['closed']['total_count']
        ],
        'per_page' => $per_page
    ];

    $json_response = $response->withJson($data);

    return $json_response;
});