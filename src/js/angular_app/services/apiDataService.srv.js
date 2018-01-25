// Define some globally used stuff
angular.module('tesonetFullstackPartyApp').factory('apiDataService',[
    '$http',
    'appConfigDataService',
    '$q',
    function (
        $http,
        appConfigDataService,
        $q
    ) {
        var service = {};

        service.getIssueListData = function(o) {
            var url = appConfigDataService.api_url + 'issues' + '?' 
                + 'state=' + o.state + '&'
                + 'page=' + o.page
            ; 
            
            var deferred = $q.defer();
            
            $http({
                method: 'GET',
                url: url
            }).then(function (response) {
                deferred.resolve({
                    data: response.data
                });
            });
            
            return deferred.promise;
        };
        
        service.getIssueData = function(o) {
            var url = appConfigDataService.api_url + 'issue' + '?' 
                + 'repo_owner=' + o.repo_owner + '&'
                + 'repo_name=' + o.repo_name + '&'
                + 'number=' + o.number + '&'
                + 'page=' + o.page
            ; 
            
            var deferred = $q.defer();
            
            $http({
                method: 'GET',
                url: url
            }).then(function (response) {
                deferred.resolve({
                    data: response.data
                });
            });
            
            return deferred.promise;
        };

        return service;
    }
]);