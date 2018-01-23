angular.module('tesonetFullstackPartyApp').directive('commentEntry', [ 
    // Look ma no external deps used :D
    function () {
        return {
            //restrict: 'E',
            replace: true,
            scope: {
               comment: '='
            },
            templateUrl: '/static/js/angular_app/templates/comment-entry.html',
            controller: function() {}
        };
    }
]);