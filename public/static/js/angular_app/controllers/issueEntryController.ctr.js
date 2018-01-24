angular.module('tesonetFullstackPartyApp').controller('issueEntryController', [
    '$scope', 
    '$http',
    '$routeParams',
    'appConfigDataService',
    '$sce',
    function(
        $scope, 
        $http,
        $routeParams,
        appConfigDataService,
        $sce
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
            
            // Generate formated text (at least that's what the ad said :D )
            var converter = new showdown.Converter();
          
            $scope.data.issue.formatted_body = $sce.trustAsHtml(converter.makeHtml($scope.data.issue.body));
          
            for (var i = 0; $scope.data.comments.length > i; i++) {
                $scope.data.comments[i].formatted_body = $sce.trustAsHtml(converter.makeHtml($scope.data.comments[i].body)); 
            }
        }); 
        
        function getNumberOfPages(total_records, per_page) {
            return Math.ceil(total_records / per_page);
        }
    }
]);