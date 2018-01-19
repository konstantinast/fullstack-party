var app = angular.module('tesonetFullstackPartyApp', ['ngRoute', 'timeRelative']);

app.config(function ($routeProvider, $locationProvider) {
    // Define routes
    $routeProvider
        .when('/', {
            templateUrl: 'static/js/angular_app/pages/main.html',
            controller: 'mainController'
        })
        .when('/issues', {
            templateUrl: 'static/js/angular_app/pages/issueList.html',
            controller: 'issueListController'
        })
        .when('/issue/:number', {
            templateUrl: 'static/js/angular_app/pages/issueEntry.html',
            controller: 'issueEntryController'
        });
        
    // use the HTML5 History API a.k.a dumping ugly # in url 
    // (which are basically fallbacks for olders web browsers)
    $locationProvider.html5Mode(true);
});

// Define some globally used stuff
app.factory('appConfigDataService',[
    function () {
        var s = {};

        s.api_url = 'http://www.tesonet-fullstack-party.com/api/';

        return s;
    }
]);

app.controller('mainController', function ($scope) {    
    $scope.message = 'I am the main page.';
});

app.controller('issueListController', [
    '$scope', 
    '$http',
    'appConfigDataService',
    function(
        $scope, 
        $http,
        appConfigDataService
    ) {
        var url = appConfigDataService.api_url + 'issues'; 
        
        $http({
            method: 'GET',
            url: url
        }).then(function (response) {
            console.log(response.data);
            
            $scope.issues = response.data;
        });

        $scope.message = 'I am an issue list page.';        
    }
]);

app.controller('issueEntryController', [
    '$scope', 
    '$http',
    '$routeParams',
    'appConfigDataService',
    function(
        $scope, 
        $http,
        $routeParams,
        appConfigDataService
    ) {
        var issue_number = $routeParams.number;
        
        if (!issue_number) {
            throw 'Issue number provided. Implement redirect to issue list or navigate to the last page in history';
        }
        
        var url = appConfigDataService.api_url + 'issue' + '/' + issue_number; 
        
        $http({
            method: 'GET',
            url: url
        }).then(function (response) {
            console.log(response.data);
            
            $scope.data = response.data;
        });  
    }
]);