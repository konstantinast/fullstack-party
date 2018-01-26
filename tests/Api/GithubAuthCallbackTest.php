<?php

namespace Tests\Api;

class GithubAuthCallbackTest extends \Tests\Api\ApiTestCase
{
    public function testGetWithoutSession()
    {
        $response = $this->runApp('GET', '/api/github_auth_callback');

        $this->assertEquals(500, $response->getStatusCode());
    }

    public function testGetWithoutSessionButRandomCode()
    {
        $code = openssl_random_pseudo_bytes(32);

        $response = $this->runApp('GET', '/api/github_auth_callback', ['code' => $code]);

        $this->assertEquals(500, $response->getStatusCode());
    }
}