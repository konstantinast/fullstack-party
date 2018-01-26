angular.module('tesonetFullstackPartyApp', ['ngRoute', 'timeRelative']);

angular.module('tesonetFullstackPartyApp').config(['$httpProvider', function($httpProvider) {  
    $httpProvider.interceptors.push('httpInterceptor');
}]);

angular.module('tesonetFullstackPartyApp').factory('httpInterceptor', [
    '$window',
    function(
        $window
    ) {
        var interceptor = {};
        
        interceptor.responseError = function(config) {
            window.test = 'hello';
            
            if (config.status === 401) {
                // Unauthorized request
                $window.location.href = '/';
            } else {
                // For a while go to index page
                $window.location.href = '/';
            }
        }
        
        return interceptor;
    }]
);

