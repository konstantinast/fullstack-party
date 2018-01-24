angular.module('tesonetFullstackPartyApp').controller('issueListController', [
    '$scope',
    '$routeParams',
    'issueListInitialData',
    function(
        $scope,
        $routeParams,
        issueListInitialData
    ) {
        var state = !$routeParams.state ? 'open': $routeParams.state;
        var page_number = parseInt(!$routeParams.page_number ? 1: $routeParams.page_number);
        $scope.state = state;
        
        var total_records = issueListInitialData.data.count[state];
        var per_page = issueListInitialData.data.per_page;
        var number_of_pages = getNumberOfPages(total_records, per_page);
                        
        $scope.pagination_data = {
            base_url: '/issues/' + state,
            number_of_pages: number_of_pages,
            current_page: page_number
        };
        
        $scope.data = issueListInitialData.data;
              
        function getNumberOfPages(total_records, per_page) {
            return Math.ceil(total_records / per_page);
        }
    }
]);