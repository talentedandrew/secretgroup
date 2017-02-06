(function () {

  angular
    .module('mySecret12')
    .service('roomService', roomService);

  roomService.$inject = ['$http', '$window', '$q'];
  function roomService($http, $window, $q) {

    var addRoom = function (room) {
      return $http.post('/api/addroom', room);
    };
    var removeRoom = function(userId,roomId){
      return $http.post('/api/removeroom/'+userId+'/'+roomId);
    }
    var getRoom = function(id){
      return $http.get('/api/searchroombyuser/'+id);
    }
    var getAddedRoom = function(id){
      return $http.get('/api/searchroombymember/'+id);
    }
    var getRoomByAdmin = function(id){
      return $http.get('/api/searchroombyid/'+id);
    }
    return {
      addRoom: addRoom,
      getRoom: getRoom,
      getAddedRoom : getAddedRoom,
      getRoomByAdmin : getRoomByAdmin,
      removeRoom : removeRoom
    };
  }


})();