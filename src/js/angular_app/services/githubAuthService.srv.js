// Define some globally used stuff
angular.module('tesonetFullstackPartyApp').factory('githubAuthService',[
    '$http',
    'appConfigDataService',
    '$q',
    '$rootScope',
    function (
        $http,
        appConfigDataService,
        $q,
        $rootScope
    ) {
        var service = {};
        service.is_login_button_loaded = false;
        service.autologin_called = false;
        service.deferred_arr = [];   
        
        $rootScope.$on('loginButtonDirectiveIsReady', function() {
            if (service.autologin_called) {
                $rootScope.$broadcast('autologinInProgress');                
            }    
            service.is_login_button_loaded = true;
            
            // Resolve all calls
            resolveCalls();
        });

        service.autologin = function() {  
            service.autologin_called = true;

            var deferred = $q.defer();
            resolveCallsIfReady(deferred);

            return deferred.promise;
        };
        
        function resolveCallsIfReady(deferred) {
            service.deferred_arr.push(deferred);
            
            if (service.is_login_button_loaded) {
                resolveCalls();
            }
        }
        
        function resolveCalls() {
            for (var i = 0; service.deferred_arr.length; i++) {
                var deffered = service.deferred_arr.shift();
                
                if (!deffered) {
                    break;
                } else {
                    resolveCall(deffered);                    
                }
            } 
        }
        
        function resolveCall(deferred) {
            var url = appConfigDataService.api_url + 'login_with_github';
            
            $http({
                method: 'POST',
                url: url,
                // since this is probably auto called and connected to resolve, 
                // so lets not force user to wait too much
                timeout: 5000
            }).then(function (response) {
                deferred.resolve({
                    'data': response.data
                });
                
                $rootScope.$broadcast('autologinEnded');
            }).catch(function (response) {
                if (!response.data) {
                    deferred.resolve({
                        'data': {
                            'error': 'timeout'
                        }
                    });                    
                } else {
                    deferred.resolve({
                        'data': {
                            'error': 'backend_failure'
                        }
                    });
                }
                
                $rootScope.$broadcast('autologinEnded');
            });            
        }
        
        return service;
    }
]);