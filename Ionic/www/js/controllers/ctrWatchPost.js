angular.module('brandly.ctrWatchPost', ['ionic', 'ngCordova'])

.controller('WatchPostCtrl', function($scope, $stateParams, $window, $location, BrandsServices){
  $scope.id = $stateParams.id;
  $scope.watchDos = function(){
    $window.localStorage['viewsBrandlyWatchDos'] = 'ultimos';
    $location.path('/watch-dos/'+$scope.id);
  }

  $scope.post = function(){
    $location.path('/post/'+$scope.id+'/watch-post');
  }

  BrandsServices.actionsPost('detailBrand', { id : $scope.id }).then(function(json){
    console.log(json);
    $scope.brand = json.result['brand'];
  });
  // console.log($window.innerHeight);
  // $scope.dragTrendingUp = function(e){
  //   console.log(e.gesture.center.pageX); 
  //   console.log(e.gesture.center.pageY); 
  //   console.log('dragTrendingUp'); 
  // }
})