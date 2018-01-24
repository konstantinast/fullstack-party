angular.module('tesonetFullstackPartyApp').config(function ($routeProvider, $locationProvider) {
    // Define routes
    $routeProvider  
        .when('/', {
            templateUrl: 'static/html/angular_app/pages/main.html',
            controller: 'mainController'
        })
        .when('/login_with_github', {
            templateUrl: 'static/html/angular_app/pages/main.html',
            controller: function() {
                window.location.replace('/api/login_with_github');
            }
        })
        .when('/logout', {
            templateUrl: 'static/html/angular_app/pages/main.html',
            controller: function() {
                window.location.replace('/api/logout');
            }
        })
        .when('/issues/:state?/:page_number?', {
            templateUrl: 'static/html/angular_app/pages/issueList.html',
            controller: 'issueListController'
        })
        .when('/issue/:repo_owner/:repo_name/:number/:page_number?', {
            templateUrl: 'static/html/angular_app/pages/issueEntry.html',
            controller: 'issueEntryController'
        });
        
    // use the HTML5 History API a.k.a dumping ugly # in url 
    // (which are basically fallbacks for olders web browsers)
    $locationProvider.html5Mode(true);
});