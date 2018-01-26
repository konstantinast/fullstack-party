angular.module('tesonetFullstackPartyApp').controller('mainController', [
    '$timeout',
    'githubAuthService',
    function(
        $timeout,
        githubAuthService
    ) {
        githubAuthService.autologin().then(function(response) {
            var data = response.data;
            
            // Handle victories
            if (data.success) {
                if (data.redir) {
                    $timeout(
                        function () {
                            window.location.replace(data.redir);
                        },
                        500
                    );                   
                }
            }
        });
    }
]);