angular.module('tesonetFullstackPartyApp').controller('issueListController', [
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