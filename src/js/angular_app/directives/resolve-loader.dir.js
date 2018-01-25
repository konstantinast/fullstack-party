angular.module('tesonetFullstackPartyApp').directive('resolveLoader', function ($rootScope, $timeout) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/static/html/angular_app/templates/loader-overlay.html',
        link: function (scope, element) {
            $rootScope.$on('$routeChangeStart', function () {
                element.removeClass('ng-hide');
            });

            $rootScope.$on('$routeChangeSuccess', function () {
                element.addClass('ng-hide');
            });
        }
    };
});