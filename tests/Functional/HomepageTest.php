<?php

namespace Tests\Functional;

class HomepageTest extends BaseTestCase
{
    /**
     * Test that the index route returns a rendered response contains base angular app code script and link tags
     */
    public function testGetHomepage()
    {
        $response = $this->runApp('GET', '/');

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertContains('ng-app="tesonetFullstackPartyApp"', (string)$response->getBody());
        $this->assertContains('id="view-container"', (string)$response->getBody());

        $this->assertContains('bootstrap/dist/css/bootstrap.min.css', (string)$response->getBody());
        $this->assertContains('font-awesome/css/font-awesome.css', (string)$response->getBody());
        $this->assertContains('font-awesome-animation/dist/font-awesome-animation.min.css"', (string)$response->getBody());
        $this->assertContains('/static/css/main.css"', (string)$response->getBody());

        $this->assertContains('angular/angular.min.js', (string)$response->getBody());
        $this->assertContains('angular-route/angular-route.min.js', (string)$response->getBody());
        $this->assertContains('ng-app.min.js"', (string)$response->getBody());
    }

    /**
     * Test that the index route with optional name argument returns a rendered greeting
     */
    public function testGetLoginWithGithubWithWget()
    {
        $response = $this->runApp('GET', '/login_with_github');

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertContains('ng-app="tesonetFullstackPartyApp"', (string)$response->getBody());
        $this->assertContains('id="view-container"', (string)$response->getBody());
    }

    /**
     * Test that the index route won't accept a post request
     */
    public function testPostHomepageNotAllowed()
    {
        $response = $this->runApp('POST', '/', ['test']);

        $this->assertEquals(405, $response->getStatusCode());
        $this->assertContains('Method not allowed', (string)$response->getBody());
    }
}