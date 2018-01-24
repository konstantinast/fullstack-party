// Define some globally used stuff
angular.module('tesonetFullstackPartyApp').factory('appConfigDataService',[
    function () {
        var s = {};

        s.api_url = document.location.protocol + '//' + document.location.host + '/api/';

        return s;
    }
]);