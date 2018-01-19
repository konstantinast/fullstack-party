<?php

use Slim\Http\Request;
use Slim\Http\Response;

$app->get('/api/issue/{number}', function (Request $request, Response $response, array $args) {
    $number = $args['number']; // internal number of issue in repo

    $this->logger->info("/api/issue/" . $number);

    $page_raw = (int)$request->getParam('page');
    $page = !empty($page_raw) ? $page_raw : 1;
    $limit = ISSUE_COMMENT_LIST_PER_PAGE_LIMIT;

    $client = new \Github\Client();

    $issue_api = $client->api('issue');

    $issue = $issue_api
        ->show(
            GITHUB_USERNAME,
            GITHUB_REPO_NAME,
            $number
        )
    ;

    $issue_comments_api = $client->api('issue')->comments(); // issue/comments

    $issue_comments_api->setPerPage($limit); // not very consistent wrapper - other places allow to pass params into fetching method

    $comments = $issue_comments_api
        ->all(
            GITHUB_USERNAME,
            GITHUB_REPO_NAME,
            $number,
            $page
        )
    ;

    $data = [
        'issue' => $issue,
        'comments' => $comments
    ];

    $json_response = $response->withJson($data);

    return $json_response;
});