<?php

use Slim\Http\Request;
use Slim\Http\Response;

$app->map(['GET', 'POST'], '/api/login_with_github', function (Request $request, Response $response, array $args) {
    $this->logger->info("/api/login_with_github route");

    $method = $request->getMethod();

    // Check whether user has access token
    $access_token_failure = true;

    if (!empty($_SESSION['github_api_access_token'])) {
        // But maybe access_token is expired
        $client = new \Github\Client();
        $client->authenticate($_SESSION['github_api_access_token'], null, Github\Client::AUTH_HTTP_TOKEN);

        try {
            $current_user = $client->currentUser();
            $user_info = $current_user->show(); // just attempt to grab data
        } catch (Exception $exc) {
            $error_code = $exc->getCode();

            if ((string) $error_code !== '401') {
                // Something interesting has happened
                // Lets log
                $error_data = [
                    'http_code' => $error_code,
                    'message' => $exc->getMessage()
                ];

                $this->logger->warning(var_export($error_data, true));
            }
        }

        if (!empty($user_info)) {
            $access_token_failure = false;
        }
    }

    switch ($method) {
        case 'POST':
            if ($access_token_failure) {
                $data['error'] = 'access_token_failure';
                $data['action'] = 'reauth';
                $data['redir'] = '/';
                $data['message'] = 'Auto login failed. Try loging in manually.';
            } else {
                $data['success'] = true;
                $data['redir'] = '/issues';
                $data['message'] = 'All ok. Redirecting to next page.';
            }

            $json_response = $response->withJson($data);

            return $json_response;
        case 'GET':
        default:
            if ($access_token_failure) {
                // Redirect user to Gihub App auth page
                $redir_url = GITHUB_APP_AUTH_URL_BASE . '?'
                    . 'client_id=' . GITHUB_APP_CLIENT_ID
                ;
            } else {
               $redir_url = '/issues';
            }

            return $response->withStatus(302)->withHeader('Location', $redir_url);
    }
});