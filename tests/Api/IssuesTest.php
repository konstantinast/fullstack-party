<?php

namespace Tests\Api;

class IssuesTest extends \Tests\Api\ApiTestCase
{
    public function testGetWithoutSession()
    {
        $response = $this->runApp('GET', '/api/issues');

        $this->assertEquals(401, $response->getStatusCode());
    }
}