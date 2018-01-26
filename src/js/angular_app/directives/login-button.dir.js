angular.module('tesonetFullstackPartyApp').directive('loginButton', function ($rootScope) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/static/html/angular_app/templates/login-button.html',
        link: function ($scope) {
            $scope.autologin_in_progress = false;
            
            $rootScope.$on('autologinInProgress', function () {
                $scope.autologin_in_progress = true;
            });
            
            $rootScope.$on('autologinEnded', function () {
                $scope.autologin_in_progress = false;
            });
            
            $rootScope.$broadcast('loginButtonDirectiveIsReady');
        }       
    };
});