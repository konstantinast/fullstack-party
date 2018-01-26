<?php

namespace Tests\Api;

class LogoutTest extends \Tests\Api\ApiTestCase
{
    public function testGetWithoutSession()
    {
        $response = $this->runApp('GET', '/api/logout');

        $this->assertEquals(401, $response->getStatusCode());
    }
}