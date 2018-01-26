<?php

use Slim\Http\Request;
use Slim\Http\Response;

/*
 * Based on example from https://github.com/KnpLabs/php-github-api/blob/master/doc/security.md
 */

$app->get('/api/github_auth_callback', function (Request $request, Response $response, array $args) {
    $this->logger->info("/api/github_auth_callback route");

    $code = $request->getParam('code'); // Github api returned key (code)

    $url = GITHUB_APP_ACCESS_TOKEN_GENERATOR;

    // Super important to send it like this
    // (in 'form_data' key when using GuzzleHttp)
    // as withouth x-www-form-urlencoded data
    // does not validate on the receiving end
    // and API just returns blank 404
    $params = [
        'form_params' => [
            'client_id' => GITHUB_APP_CLIENT_ID,
            'client_secret' => GITHUB_APP_CLIENT_SECRET,
            'code' => $code
        ],
        'headers' => [
            'Accept'     => 'application/json'
        ]
    ];

    // How to get raw request data for debug purposes
    // https://github.com/guzzle/guzzle/issues/1688#issuecomment-267443856
    $client = new \GuzzleHttp\Client();
    $psr_response = $client->request('POST', $url, $params);

    $raw_response = $psr_response->getBody()->getContents();
    $data = json_decode($raw_response);

    $access_token = $data->access_token;

    $_SESSION['github_api_access_token'] = $access_token;

    $redir_url = '/issues';

    return $response->withStatus(302)->withHeader('Location', $redir_url);
});