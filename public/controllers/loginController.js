(function () {

    angular
        .module('mySecret12')
        .controller('loginCtrl', loginCtrl);

    loginCtrl.$inject = ['$state', 'authentication'];
    function loginCtrl($state, authentication) {
        authentication.logout();
        var vm = this;

        vm.credentials = {
            email: "",
            password: ""
        };

        vm.onSubmit = function () {
            authentication
            .login(vm.credentials)
            .then(function (data) {
                authentication.saveToken(data.data.token);
                authentication.saveId(data.data.user._id);
                $state.go('dashboard');
            })
            .catch(function (error) {
                console.log(error)    
            });
        };

    }

})();