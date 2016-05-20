angular.module('tactic.services', [])

.factory('Scopes', function ($rootScope) {
    var mem = {};
 
    return {
        store: function (key, value) {
            $rootScope.$emit('scope.stored', key);
            mem[key] = value;
            console.log("registrado ===>" + key);
        },
        get: function (key) {
            return mem[key];
        }
    };
});
