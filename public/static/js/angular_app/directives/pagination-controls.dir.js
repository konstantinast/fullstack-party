angular.module('tesonetFullstackPartyApp').directive('paginationControls', [ 
    '$sce',
    '$http',
    '$templateRequest',
    '$compile',
    '$timeout',
    function(
        $sce,
        $http,
        $templateRequest,
        $compile,
        $timeout
    ){
        return {
            restrict: 'E',
            //replace: true,
            scope: {
               d: '=' // d as data
            },
            link: function($scope, $element, $attrs) {
                var clearWaitcherForD = $scope.$watch("d", function (newValue, oldValue) {
                    if (angular.isDefined(newValue)) {
                        clearWaitcherForD();
                                           
                        $templateRequest(
                            $sce.trustAsResourceUrl('/static/js/angular_app/templates/pagination-controls.html')
                        ).then(function (html) {
                            var template = angular.element(html);
                            //$element.append(template);
                            $element.replaceWith(template);
                            $compile(template)($scope);
                            
                            $timeout(
                                function () {
                                    $scope.d = angular.merge(
                                        $scope.d, 
                                        {               
                                            page_numbers: generatePageNumbers($scope.d.current_page, $scope.d.number_of_pages),
                                            prev_page_number: generatePrevPageNumber($scope.d.current_page, $scope.d.number_of_pages),
                                            next_page_number: generateNextPageNumber($scope.d.current_page, $scope.d.number_of_pages),
                                            current_page: $scope.d.current_page
                                        }
                                    );
                                }
                            );
                        });
                    }
                });
                
                // Functions
                function generatePageNumbers(current_page, number_of_pages) {                    
                    var delta = 1;

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

                    // Remove empty 0 at the end, just in case :)
                    if (page_number[page_number.length - 1] === 0) {
                        delete page_number[page_number.length - 1];
                    }

                    return page_number;
                }

                function generatePrevPageNumber(current_page, number_of_pages) {
                    var number = current_page - 1;

                    if (
                        number < 1 // underflow
                        ||
                        number_of_pages === 1
                    ) {
                        number = null;
                    }

                    return number;
                }

                function generateNextPageNumber(current_page, number_of_pages) {
                    var number = current_page + 1;

                    if (
                        number > number_of_pages // overflow
                        ||
                        number_of_pages === 1
                    ) {
                        number = null;
                    }
                    return number;
                }
            },
            controller: function($scope) {

            }
        };
    }
]);