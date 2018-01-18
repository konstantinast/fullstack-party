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
    $api = $client->api('issue')->comments(); // issue/comments

    $api->setPerPage($limit); // not very consistent wrapper - other places allow to pass params into fetching method

    $issue = $api
        ->all(
            GITHUB_USERNAME,
            GITHUB_REPO_NAME,
            $number,
            $page
        )
    ;

    $json_response = $response->withJson($issue);

    return $json_response;
});