var app = angular.module('tesonetFullstackPartyApp', ['ngRoute', 'timeRelative']);

app.config(function ($routeProvider, $locationProvider) {
    // Define routes
    $routeProvider  
        .when('/', {
            templateUrl: 'static/js/angular_app/pages/main.html',
            controller: 'mainController'
        })
        .when('/login_with_github', {
            templateUrl: 'static/js/angular_app/pages/main.html',
            controller: function() {
                window.location.replace('/api/login_with_github');
            }
        })
        .when('/logout', {
            templateUrl: 'static/js/angular_app/pages/main.html',
            controller: function() {
                window.location.replace('/api/logout');
            }
        })
        .when('/issues/:state?/:page_number?', {
            templateUrl: 'static/js/angular_app/pages/issueList.html',
            controller: 'issueListController'
        })
        .when('/issue/:repo_owner/:repo_name/:number/:page_number?', {
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

        s.api_url = document.location.protocol + '//' + document.location.host + '/api/';

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
        var page_number = parseInt(!$routeParams.page_number ? 1: $routeParams.page_number);
        var url = appConfigDataService.api_url + 'issues' + '?' 
            + 'state=' + state + '&'
            + 'page=' + page_number
        ; 
        
        $http({
            method: 'GET',
            url: url
        }).then(function (response) {               
            var total_records = response.data.count[state];
            var per_page = response.data.per_page;
            var number_of_pages = getNumberOfPages(total_records, per_page);
                        
            $scope.pagination_data = {
                base_url: '/issues/' + state,
                number_of_pages: number_of_pages,
                current_page: page_number
            };
            
            $scope.data = response.data;
        });
        
        $scope.state = state;
        
        function getNumberOfPages(total_records, per_page) {
            return Math.ceil(total_records / per_page);
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
        var repo_owner = $routeParams.repo_owner;
        var repo_name = $routeParams.repo_name;
        var page_number = parseInt(!$routeParams.page_number ? 1: $routeParams.page_number);
        var url = appConfigDataService.api_url + 'issue' + '?' 
            + 'repo_owner=' + repo_owner + '&'
            + 'repo_name=' + repo_name + '&'
            + 'number=' + issue_number + '&'
            + 'page=' + page_number
        ; 
                
        $http({
            method: 'GET',
            url: url
        }).then(function (response) { 
            var total_records = response.data.count;
            var per_page = response.data.per_page;
            var number_of_pages = getNumberOfPages(total_records, per_page);
                        
            $scope.pagination_data = {
                base_url: '/issue/' + repo_owner + '/' + repo_name + '/' + issue_number,
                number_of_pages: number_of_pages,
                current_page: page_number
            };
            
            $scope.data = response.data;
        }); 
        
        function getNumberOfPages(total_records, per_page) {
            return Math.ceil(total_records / per_page);
        }
    }
]);