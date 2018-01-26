<?php

namespace Tests\Api;

class IssueTest extends \Tests\Api\ApiTestCase
{
    public function testGetWithoutSession()
    {
        $response = $this->runApp('GET', '/api/issue');

        $this->assertEquals(401, $response->getStatusCode());
    }
}