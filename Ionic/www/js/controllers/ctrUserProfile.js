angular.module('brandly.ctrUserProfile', ['ionic', 'ngCordova'])

.controller('UserProfileCtrl', function($scope, $stateParams, $location, $ionicPopup, $ionicActionSheet, $window, MensajesAlerta, user, ngUser, ImageServicePerfil, UsuariosServices ){
  $scope.messages = MensajesAlerta.mensajesIdi();
  //Mostrar como vienen
  if (angular.isObject(user.get('usuario_brandly'))) {
      ngUser.$restore(user.get('usuario_brandly'));
  } else {
      ngUser.init();
  }

  $scope.user = ngUser.getUser();

  $scope.settingProfile = function(){
    $location.path('/perfil/user-profile');
  }

  $scope.actionExplore1 = function(){
    $location.path('/explore-1');
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

  $scope.addImagePerfil = function(type, i) {
    $scope.hideSheet();
    ImageServicePerfil.handleMediaDialog(type, i).then(function() {
      $scope.$apply();
    });
  }

  $scope.editarImagen = function(){
    if ( !$scope.buttonSave){
      $scope.hideSheet = $ionicActionSheet.show({
        buttons: [
          { text: $scope.messages['textFotoPerfil'] },
          { text: $scope.messages['textFotoPerfil2'] },
          { text: $scope.messages['textFotoAlbum'] },
          { text: $scope.messages['textFotoAlbum2'] }
        ],
        titleText: $scope.messages['textAnadirFoto'],
        cancelText: $scope.messages['textCancelar'],
        buttonClicked: function(index) {
          $scope.addImagePerfil(index, 'imagenUsuario');
        },
        cancel: function() {
          $scope.openOptionPost = false;
        },
      });
    }
  }

  $scope.$on('mostrarImagePerfil', function(events, args){
    // alert(args);
    $scope.cachePerfil = $scope.user.imgPerfil;
    $scope.user.imgPerfil = "data:image/jpeg;base64," + args;
    $scope.imagenTemporal = args;
    $scope.buttonSave = 1;
  });

  $scope.$on('modificarImagePerfil', function(events, args){
    if ($window.localStorage['cache']) {
      $window.localStorage['cache']++;
    }else{
      $window.localStorage['cache'] = 1;
    }
    $scope.user.imgPerfil = args["imagen"]+"?cache="+$window.localStorage['cache'];
  });

  $scope.guardarImagen = function(){
    if( $scope.buttonSave == 1 ){
      $scope.data = {
        file: $scope.imagenTemporal
      }
      UsuariosServices.guardarImagen('guardarImagenPerfil', $scope.data);
    }else{
      $scope.data = {
        file: $scope.imagenTemporalPortada
      }
      UsuariosServices.guardarImagen('guardarImagenPortada', $scope.data);
    }
    $scope.buttonSave = 0;
  }

  $scope.cancelarImagen = function(){
    if( $scope.buttonSave == 1 ){
      $scope.user.imgPerfil = $scope.cachePerfil;
    }else{
      $scope.user.imgPortada = $scope.cachePortada;
    }
    $scope.buttonSave = 0;
  }

  $scope.$on('mostrarImagePortada', function(events, args){
    // alert(args);
    $scope.cachePortada = $scope.user.imgPortada;
    $scope.user.imgPortada = "data:image/jpeg;base64," + args;
    $scope.imagenTemporalPortada = args;
    $scope.buttonSave = 2;
  });

  $scope.$on('modificarImagePortada', function(events, args){
    if ($window.localStorage['cachePortada']) {
      $window.localStorage['cachePortada']++;
    }else{
      $window.localStorage['cachePortada'] = 1;
    }
    $scope.user.imgPortada = args["imagen"]+"?cache="+$window.localStorage['cachePortada'];
  });

})