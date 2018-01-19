var app = angular.module('tesonetFullstackPartyApp', ['ngRoute', 'timeRelative']);

app.config(function ($routeProvider, $locationProvider) {
    // Define routes
    $routeProvider
        .when('/', {
            templateUrl: 'static/js/angular_app/pages/main.html',
            controller: 'mainController'
        })
        .when('/issues/:state?/:page_number?', {
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
    '$routeParams',
    'appConfigDataService',
    function(
        $scope, 
        $http,
        $routeParams,
        appConfigDataService
    ) {
        var state = !$routeParams.state ? 'open': $routeParams.state;
        var page_number = !$routeParams.page_number ? 1: $routeParams.page_number;;
        var url = appConfigDataService.api_url + 'issues' + '?' 
            + 'state=' + state + '&'
            + 'page=' + page_number
        ; 
        
        $http({
            method: 'GET',
            url: url
        }).then(function (response) {               
            var total = response.data.count[state];
            var per_page = response.data.per_page;
            $scope.page_numbers = generatePageNumbers(page_number, total, per_page);
            
            $scope.data = response.data;
        });
        
        $scope.state = state;
        
        function generatePageNumbers(current_page, total, per_page) {
            var delta = 1;
            
            var number_of_pages = parseInt(total / per_page);
            var first_page_number = 1;
            var last_page_number = number_of_pages;
            var from = parseInt(current_page) - delta;
            var to = parseInt(current_page) + delta;
            var range = [];
            
            if (from < 1) {
                from = 1;
            }
            
            if (to > last_page_number) {
                to = last_page_number;
            }
            
            for (var i = from; i <= to; i++) {
                range.push(i);
            }
            
            // Add first
            if (range[0] !== first_page_number) {
                range.unshift(first_page_number);             
            }
            
            // And last page number
            if (range[range.length - 1] !== last_page_number) {
                range.push(last_page_number);             
            }
            
            // Lets add null to gaps
            var page_number = [];
            
            for (var i = 0; i < range.length; i++) {
                if (range[i+1] - range[i] > 1) {
                    page_number.push(range[i]);
                    page_number.push(0);
                } else {
                    page_number.push(range[i]);
                }
            }         

            return page_number;
        }
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
            $scope.data = response.data;
        });  
    }
]);