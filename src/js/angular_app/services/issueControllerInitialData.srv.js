angular.module('tesonetFullstackPartyApp')
    .factory('issueControllerInitialData',[
        'apiDataService',
        '$q',
        function (
            apiDataService,
            $q
        ) {
            var service = {};
            
            service.getData = function(o) {
                return apiDataService.getIssueData(o);              
            };

            return service;
        }
    ]);