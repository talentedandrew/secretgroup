(function () {

  angular
    .module('mySecret12')
    .controller('registerCtrl', registerCtrl);

  registerCtrl.$inject = ['$state', 'authentication'];
  function registerCtrl($state, authentication) {
    var vm = this;

    vm.credentials = {};

    vm.onSubmit = function () {
      console.log('Submitting registration');
      authentication
        .register(vm.credentials)
        .then(function(data){
          console.log(data);  
          $state.go('dashboard');
        })
        .catch(function(error){
            console.log(error);
        });
    };

  }

})();