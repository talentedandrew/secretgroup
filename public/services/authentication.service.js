(function () {

  angular
    .module('mySecret12')
    .service('authentication', authentication);

  authentication.$inject = ['$http', '$window','$q'];
  function authentication ($http, $window,$q) {

    var saveToken = function (token) {
      $window.localStorage['bearer-token'] = token;
    };

    var getId = function () {
      return $window.localStorage['user-id'];
    };
    var saveId = function (id) {
      $window.localStorage['user-id'] = id;
    };

    var getToken = function () {
      return $window.localStorage['bearer-token'];
    };
    
    var saveName = function (name) {
      $window.localStorage['user-name'] = name.firstname + " "+ name.lastname;
    };
    var getName = function () {
      return $window.localStorage['user-name'];
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

    register = function(user) {
      return $http.post('/api/register', user);
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
      saveId : saveId,
      getId : getId,
      saveName : saveName,
      getName : getName,
      isLoggedIn : isLoggedIn,
      register : register,
      login : login,
      logout : logout
    };
  }


})();