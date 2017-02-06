(function () {

  angular
    .module('mySecret12')
    .controller('dashboardCtrl', dashboardCtrl);

  dashboardCtrl.$inject = ['$state','$scope', 'authentication', 'roomService', 'ngToast'];
  function dashboardCtrl($state,$scope, authentication, roomService, ngToast) {
    var vm = this;
    vm.room = {};
    vm.rooms = {};//rooms made by user
    vm.addedRooms = {};//rooms in which user is added
    vm.room.createdBy = authentication.getId();//userid of user
    vm.showRoomButton = true;
    // configuration of the scroll bar
    vm.config = {};
    vm.scrollbar = function (direction, autoResize, show) {
      vm.config.direction = direction;
      vm.config.autoResize = autoResize;
      vm.config.scrollbar = {
        show: !!show
      };
      return vm.config;
    }

    //get all the rooms created by the user
    vm.getAllRooms = function () {
      roomService.getRoom(vm.room.createdBy)
        .then(function (data) {
          if (data.data.success) {
            if (data.data.rooms) {
              vm.rooms = data.data.rooms;
            }
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
    // get all the rooms in which user is added
    vm.getAddedRooms = function () {
      roomService.getAddedRoom(vm.room.createdBy)
        .then(function (data) {
          if (data.data.success) {
            if (data.data.rooms) {
              vm.addedRooms = data.data.rooms;
            }
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
    }

    // logout from the portal
    vm.logout = function () {
      authentication.logout();
      $state.go('login');
    };
    vm.openAddRoom = function () {
      vm.room.roomName = '';
      vm.showRoomButton = !vm.showRoomButton;
    }

    //create a room
    vm.createRoom = function () {
      roomService.addRoom(vm.room)
        .then(function (data) {
          if (data.data.success) {
            vm.openAddRoom();
            vm.getAllRooms();
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
    }
    vm.deleteRoom = function (id) {
      roomService.removeRoom(vm.room.createdBy,id)
        .then(function (data) {
          if (data.data.success) {
            vm.getAllRooms();
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
    }

  }

})();