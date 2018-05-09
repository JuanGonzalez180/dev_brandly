// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'brandly' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'brandly.services' is found in services.js
// 'brandly.controllers' is found in controllers.js

var ver = '?v=0.0.11022';
var device = '';

angular.module('brandly', ['ionic', 
                            'ionic-datepicker', 
                            'brandly.controllers', 
                            'brandly.ctrBrandProfile',
                            'brandly.ctrBrandProfilePost',
                            'brandly.ctrComments',
                            'brandly.ctrLogin',
                            'brandly.ctrMovimientos',
                            'brandly.ctrPerfil',
                            'brandly.ctrPerfilSet',
                            'brandly.ctrPost',
                            'brandly.ctrPostComment',
                            'brandly.ctrScanBrand',
                            'brandly.ctrUserProfile',
                            'brandly.ctrWatchDos',
                            'brandly.ctrWatchPost',
                            'brandly.services', 
                            'ionic-datepicker', 
                            'ngCordovaOauth', 
                            'ngCordova', 
                            'ngOpenFB', 
                            'firebase', 
                            'ionic.cloud'
                          ])

.constant('$ionicLoadingConfig', {
  templateUrl: "templates/loading.html",
})

.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}])

.run(function($ionicPlatform, $state, ngFB) {

  ngFB.init({
    appId: '449763622092841',
    status : false,
    xfbml: true,
    cookie: true,
    oauth: true,
    version: 'v2.11'
  });

  //No logueado
  $state.transitionTo('login');


  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      if (ionic.Platform.platform() == "android") {
        // StatusBar.style(1);
      }
    }
  });
})

.config(function (ionicDatePickerProvider) {
    var datePickerObj = {
      inputDate: new Date(),
      titleLabel: 'Select a Date',
      setLabel: 'Set',
      todayLabel: 'Today',
      closeLabel: 'Close',
      mondayFirst: false,
      weeksList: ["S", "M", "T", "W", "T", "F", "S"],
      monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
      templateType: 'popup',
      // from: new Date(2012, 8, 1),
      // to: new Date(2018, 8, 1),
      showTodayButton: true,
      dateFormat: 'dd MMMM yyyy',
      closeOnSelect: false,
      disableWeekdays: []
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);
  })

.config(['$ionicConfigProvider', function($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.views.swipeBackEnabled(false);
}])

.directive('backButton', ['$window', function($window) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.bind('click', function () {
                $window.history.back();
            });
        }
    };
}])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html'+ver,
    cache: false,
    controller: 'LoginCtrl'
  })

  .state('scan-brand', {
    url: '/scan-brand',
    templateUrl: 'templates/scan-brand.html'+ver,
    cache: false,
    controller: 'ScanBrandCtrl'
  })

  .state('watch-post', {
    url: '/watch-post/:id',
    templateUrl: 'templates/watch-post.html'+ver,
    cache: false,
    controller: 'WatchPostCtrl'
  })

  .state('perfil', {
    url: '/perfil/:id',
    templateUrl: 'templates/perfil.html'+ver,
    cache: false,
    controller: 'PerfilCtrl'
  })

  .state('extra-information', {
    url: '/extra-information/:name',
    templateUrl: 'templates/extra-information.html'+ver,
    cache: false,
    controller: 'ExtraInformationCtrl'
  })

  .state('set-birthday', {
    url: '/set-birthday',
    templateUrl: 'templates/set-birthday.html'+ver,
    cache: false,
    // controller: 'SetBirthdayCtrl'
  })

  .state('set-mobile', {
    url: '/set-mobile',
    templateUrl: 'templates/set-mobile.html'+ver,
    cache: false,
    controller: 'SetMobileCtrl'
  })

  .state('set-password', {
    url: '/set-password',
    templateUrl: 'templates/set-password.html'+ver,
    cache: false,
    controller: 'SetPasswordCtrl'
  })

  .state('set-username', {
    url: '/set-username',
    templateUrl: 'templates/set-username.html'+ver,
    cache: false,
    controller: 'SetUsernameCtrl'
  })

  .state('set-name', {
    url: '/set-name',
    templateUrl: 'templates/set-name.html'+ver,
    cache: false,
    controller: 'SetNameCtrl'
  })

  .state('set-email', {
    url: '/set-email',
    templateUrl: 'templates/set-email.html'+ver,
    cache: false,
    controller: 'SetEmailCtrl'
  })

  .state('watch-dos', {
    url: '/watch-dos/:id',
    templateUrl: 'templates/watch-dos.html'+ver,
    cache: false,
    controller: 'WatchDosCtrl'
  })

  .state('comments', {
    url: '/comments/:id',
    templateUrl: 'templates/comments.html'+ver,
    cache: false,
    controller: 'CommentsCtrl'
  })

  .state('brand-profile-post', {
    url: '/brand-profile-post/:id',
    templateUrl: 'templates/brand-profile-post.html'+ver,
    cache: false,
    controller: 'BrandProfilePostCtrl'
  })

  .state('brand-profile', {
    url: '/brand-profile/:id',
    templateUrl: 'templates/brand-profile.html'+ver,
    cache: false,
    controller: 'BrandProfileCtrl'
  })

  .state('post', {
    url: '/post/:id/:name',
    templateUrl: 'templates/post.html'+ver,
    cache: false,
    controller: 'PostCtrl'
  })

  .state('post-comment', {
    url: '/post-comment/:id/:name',
    templateUrl: 'templates/post-comment.html'+ver,
    cache: false,
    controller: 'PostCommentCtrl'
  })

  .state('user-profile', {
    url: '/user-profile',
    templateUrl: 'templates/user-profile.html'+ver,
    cache: false,
    controller: 'UserProfileCtrl'
  })

  .state('notifications', {
    url: '/notifications/:name',
    templateUrl: 'templates/notifications.html'+ver,
    cache: false,
    controller: 'NotificationsCtrl'
  })

  .state('explore-1', {
    url: '/explore-1',
    templateUrl: 'templates/explore-1.html'+ver,
    cache: false,
    // controller: 'Explore1Ctrl'
  })

  .state('explore-2', {
    url: '/explore-2',
    templateUrl: 'templates/explore-2.html'+ver,
    cache: false,
    // controller: 'Explore2Ctrl'
  })

  // if none of the above states are matched, use this as the fallback
  // $urlRouterProvider.otherwise('/tab/dash');

});
