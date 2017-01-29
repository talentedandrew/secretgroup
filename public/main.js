(function () {

  angular.module('mySecret12', ['ui.router',]);

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

  angular
    .module('mySecret12')
    .config(["$stateProvider", "$urlRouterProvider", config])
    .run(['$rootScope', '$state', 'authentication', run]);

})();