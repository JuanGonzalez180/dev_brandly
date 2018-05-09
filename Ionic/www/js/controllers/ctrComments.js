angular.module('brandly.ctrComments', ['ionic', 'ngCordova'])

.controller('CommentsCtrl', function($scope, $stateParams){
  console.log($stateParams.id);
})