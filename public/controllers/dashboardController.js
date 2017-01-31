(function () {

  angular
    .module('mySecret12')
    .controller('dashboardCtrl', registerCtrl);

  registerCtrl.$inject = ['$state', 'authentication','roomService'];
  function registerCtrl($state, authentication,roomService) {
    var vm = this;
    vm.room = {};
    vm.room.createdBy = authentication.getId();

    vm.logout = function () {
      authentication.logout();
      $state.go('login');
    };

    vm.createRoom = function(){
      roomService.addRoom(vm.room)
      .then(function(data){
        console.log(data);
      })
      .catch(function(error){
        console.log(error);
      });
    }

  }

})();