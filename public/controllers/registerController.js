(function () {

  angular
    .module('mySecret12')
    .controller('registerCtrl', registerCtrl);

  registerCtrl.$inject = ['$state', '$scope', 'authentication', '$timeout', 'ngToast'];
  function registerCtrl($state,$scope, authentication, $timeout, ngToast) {
    var vm = this;

    vm.credentials = {};

    vm.onSubmit = function (registerForm) {
      console.log('Submitting registration');
      authentication
        .register(vm.credentials)
        .then(function (data) {
          vm.credentials = {};
          registerForm.$setPristine();
          if (data.data.success) {

            vm.timer = $timeout(function () {
              $state.go('login');
            }, 2000);
            ngToast.create({
              className: 'success',
              content: data.data.message
            });
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
      $timeout.cancel( vm.timer );
      ngToast.dismiss();
    });

  }

})();