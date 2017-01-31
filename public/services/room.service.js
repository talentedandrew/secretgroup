(function () {

  angular
    .module('mySecret12')
    .service('roomService', roomService);

  roomService.$inject = ['$http', '$window','$q'];
  function roomService ($http, $window,$q) {

    var saveToken = function (token) {
      $window.localStorage['bearer-token'] = token;
    };

    var getToken = function () {
      return $window.localStorage['bearer-token'];
    };

    var isLoggedIn = function() {
      var token = getToken();
      var payload;

      if(token){
        payload = token.split('.')[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);

        return payload.exp > Date.now() / 1000;
      } else {
        return false;
      }
    };

    var currentUser = function() {
      if(isLoggedIn()){
        var token = getToken();
        var payload = token.split('.')[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);
        return {
          email : payload.email,
          name : payload.name
        };
      }
    };

    addRoom = function(room) {
      return $http.post('/api/addroom', room);
    };

    login = function(user) {
      return $http.post('/api/login', user);
    };

    logout = function() {
      $window.localStorage.removeItem('bearer-token');
    };

    return {
      currentUser : currentUser,
      saveToken : saveToken,
      getToken : getToken,
      isLoggedIn : isLoggedIn,
      addRoom : addRoom,
      login : login,
      logout : logout
    };
  }


})();