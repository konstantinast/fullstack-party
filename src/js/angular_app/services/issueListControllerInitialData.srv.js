angular.module('tesonetFullstackPartyApp')
    .factory('issueListControllerInitialData',[
        'apiDataService',
        '$q',
        function (
            apiDataService,
            $q
        ) {
            var service = {};
            
            service.getData = function(o) {
                return apiDataService.getIssueListData(o);              
            };

            return service;
        }
    ]);