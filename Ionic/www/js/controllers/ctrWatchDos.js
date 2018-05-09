angular.module('brandly.ctrWatchDos', ['ionic', 'ngCordova'])

.controller('WatchDosCtrl', function($scope, $stateParams, $window, $location, $ionicPopup, $ionicModal, $ionicSlideBoxDelegate, BrandsServices){
  $scope.id = $stateParams.id;
  $scope.viewsBrandly = $window.localStorage['viewsBrandlyWatchDos'];

  $scope.brands = [];
  $scope.data = {
    id: $scope.id,
    views: $scope.viewsBrandly,
    offset: 0,
    limit: 10,
  }
  $scope.height = $window.innerHeight;
  $scope.contador = 0;
  
  BrandsServices.actionsPost('getBrandlyWatchDos', $scope.data ).then(function(json){
    if(typeof(json.result["success"])!="undefined" && json.result["success"]){
      if (json.result['brands']) {
        console.log(json.result['brands'].length);
        for (brand in json.result['brands']) {
          $scope.brands.push(json.result['brands'][brand]);
          if ($scope.contador == 0) {
            $scope.brand = json.result['brands'][brand];
          }
          $ionicSlideBoxDelegate.update();
          $scope.contador++;
        }
      }
    }
  });

  $scope.gallerySlideChanged = function(index){
    $scope.brand = $scope.brands[index];
  }

  $scope.current_image = 'img/fondo-watch.jpg';

  $scope.actionBack = function(){
    $location.path('/watch-post/1');
  }

  $scope.actionBrandProfilePost = function(){
    $location.path('/brand-profile-post/1');
  }

  $scope.compartir = function(){
    var myPopupShare = $ionicPopup.show({
      templateUrl: 'templates/watch-popup-share.html'+ver,
      cssClass: 'popup-share',
      title: '',
      scope: $scope,
      buttons: [
      ]
    });

    $scope.cerrarPopupShare = function(){
      console.log('cerrar'); 
      myPopupShare.close();
    }
    $scope.share = function(type){
      console.log(type);
    }
  }

  $scope.comments = function(){
    // $location.path('/comments/1');
    var myPopupComments = $ionicPopup.show({
      templateUrl: 'templates/comments.html'+ver,
      cssClass: 'popup-comments',
      title: '',
      scope: $scope,
      buttons: [
      ]
    });

    $scope.cerrarPopupComments = function(){
      myPopupComments.close();
    }
  }

  $scope.irBrand = function(){
    $location.path('/brand-profile/1');
  }
})