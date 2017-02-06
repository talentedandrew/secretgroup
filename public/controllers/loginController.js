(function () {

    angular
        .module('mySecret12')
        .controller('loginCtrl', loginCtrl);

    loginCtrl.$inject = ['$state', '$scope', 'authentication', 'ngToast'];
    function loginCtrl($state, $scope, authentication, ngToast) {
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
                    if (data.data.success) {
                        authentication.saveToken(data.data.token);
                        authentication.saveId(data.data.user._id);
                        authentication.saveName({ firstname: data.data.user.firstname, lastname: data.data.user.lastname });
                        $state.go('dashboard');
                    }
                    else {
                        ngToast.create({
                            className: 'warning',
                            content: data.data.message
                        });
                    }

                })
                .catch(function (error) {
                    ngToast.create({
                        className: 'warning',
                        content: error.data.message
                    });
                });
        };
        $scope.$on("$stateChangeStart", function () {
            ngToast.dismiss();
        });
    }


})();