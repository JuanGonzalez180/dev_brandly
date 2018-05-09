function errorHandler(error) {
  console.log(error);
}

angular.module('brandly.controllers', [])

// Controladores generales
.controller('ExtraInformationCtrl', function($scope, $stateParams, $location, TermsServices){
  $scope.actual = $stateParams.name;
  $scope.terms = TermsServices.getTerms();
})

.controller('NotificationsCtrl', function($scope, $stateParams, $location){
  $scope.shouldShowDelete = false;
})

