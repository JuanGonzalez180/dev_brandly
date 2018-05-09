angular.module('brandly.ctrBrandProfile', ['ionic', 'ngCordova'])

.controller('BrandProfileCtrl', function($scope, $stateParams){
  // console.log($stateParams.id);

  element = angular.element(document.getElementById("marca"))[0].clientWidth
  $scope.tamano = (element/3 - 20);
})