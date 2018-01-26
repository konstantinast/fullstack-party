<?php

namespace Tests\Api;

class LoginWithGithubTest extends \Tests\Api\ApiTestCase
{
    public function testGetWithoutSession()
    {
        $response = $this->runApp('GET', '/api/login_with_github');

        $redir_url = GITHUB_APP_AUTH_URL_BASE . '?'
            . 'client_id=' . GITHUB_APP_CLIENT_ID
        ;

        $this->assertEquals(302, $response->getStatusCode());
        $this->assertEquals($response->getHeaderLine('Location'), $redir_url);


    }
}