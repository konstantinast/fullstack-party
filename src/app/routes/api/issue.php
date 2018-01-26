<?php

use Slim\Http\Request;
use Slim\Http\Response;

$app->get('/api/issue', function (Request $request, Response $response, array $args) {
    $number = $request->getParam('number'); // internal number of issue in repo
    $repo_owner = $request->getParam('repo_owner');
    $repo_name = $request->getParam('repo_name');

    $this->logger->info("/api/issue/" . $number);

    $page_raw = (int)$request->getParam('page');
    $page = !empty($page_raw) ? $page_raw : 1;
    $limit = ISSUE_COMMENT_LIST_PER_PAGE_LIMIT;

    try {
        $client = new \Github\Client();
        $client->authenticate($_SESSION['github_api_access_token'], null, Github\Client::AUTH_HTTP_TOKEN);

        $current_user = $client->currentUser();
        $current_user->show(); // just to cause exception if user is unauthentificated
    } catch (Exception $exc) {
        return $response->withStatus(401);
    }

    $issue_api = $client->api('issue');

    $issue = $issue_api
        ->show(
            $repo_owner,
            $repo_name,
            $number
        )
    ;

    $issue_comments_api = $client->api('issue')->comments(); // issue/comments

    $issue_comments_api->setPerPage($limit); // not very consistent wrapper - other places allow to pass params into fetching method

    $comments = $issue_comments_api
        ->all(
            $repo_owner,
            $repo_name,
            $number,
            $page
        )
    ;

    $data = [
        'issue' => $issue,
        'comments' => $comments,
        'count' => $issue['comments'],
        'per_page' => $limit
    ];

    $json_response = $response->withJson($data);

    return $json_response;
});