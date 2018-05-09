angular.module('brandly.ctrBrandProfilePost', ['ionic', 'ngCordova'])

.controller('BrandProfilePostCtrl', function($scope, $stateParams, $location){
  console.log($stateParams.id);

  element = angular.element(document.getElementById("marca"))[0].clientWidth
  $scope.tamano = (element/3 - 20);

  $scope.accionBrandPost = function(){
    $location.path('/watch-dos/1');
  }

  $scope.clickPost = function(){
    $location.path('/watch-dos/1');
  }

  $scope.actionClickPost = function(){
    $location.path('/post/1/brand-profile-post');
  }

  $scope.actionClickUser = function(){
    $location.path('/user-profile');
  }
})