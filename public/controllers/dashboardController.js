(function () {

  angular
    .module('mySecret12')
    .controller('dashboardCtrl', registerCtrl);

  registerCtrl.$inject = ['$state', 'authentication'];
  function registerCtrl($state, authentication) {
    var vm = this;

    vm.logout = function () {
      authentication.logout();
      $state.go('login');
    };

  }

})();