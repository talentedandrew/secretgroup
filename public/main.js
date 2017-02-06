(function () {

  angular.module('mySecret12', ['ui.router', 'ui.bootstrap', 'ngToast', 'mb-scrollbar', 'btford.socket-io']);

  function config($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state({
        name: 'register',
        url: '/register',
        templateUrl: './views/register.html',
        controller: 'registerCtrl',
        controllerAs: 'vm'
      })
      .state({
        name: 'login',
        url: '/login',
        templateUrl: './views/login.html',
        controller: 'loginCtrl',
        controllerAs: 'vm'
      })
      .state({
        name: 'dashboard',
        url: '/dashboard',
        templateUrl: './views/dashboard.html',
        controller: 'dashboardCtrl',
        controllerAs: 'vm'
      })
      .state({
        name: 'room',
        url: '/room',
        templateUrl: './views/room.html',
        controller: 'roomCtrl',
        controllerAs: 'vm',
        params: {
          roomId: null
        }
      });
    $urlRouterProvider.otherwise('/login');
  };
  function run($rootScope, $state, authentication) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      if (toState.name === 'dashboard' && !authentication.isLoggedIn()) {
        event.preventDefault();
        $state.go('login');
      }


    });
  }
  function httpRequestInterceptor($window) {
    return {
      request: function (config) {
        if ($window.localStorage['bearer-token']) {
          config.headers['Authorization'] = 'Bearer ' + $window.localStorage['bearer-token'];
        }
        return config;
      }
    };
  };

  function httpProvider($httpProvider) {
    $httpProvider.interceptors.push('httpRequestInterceptor');
  };
  function ngToastConfig(ngToastProvider) {
    ngToastProvider.configure({
      animation: 'slide' // or 'fade'
    });
  }
  function mySocket(socketFactory) {
    var socket = socketFactory();
    socket.forward('broadcast');
    return socket;
  }
  angular
    .module('mySecret12')
    .config(["$stateProvider", "$urlRouterProvider", config])
    .run(['$rootScope', '$state', 'authentication', run])
    .factory('httpRequestInterceptor', ["$window", httpRequestInterceptor])
    .config(['$httpProvider', httpProvider])
    .config(['ngToastProvider', ngToastConfig])
    .factory('socket', ['socketFactory', mySocket]);
})();