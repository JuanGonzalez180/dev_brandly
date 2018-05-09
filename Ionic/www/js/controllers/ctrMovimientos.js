angular.module('brandly.ctrMovimientos', ['ionic', 'ngCordova'])

.controller('MovimientosCtrl', function($scope, $stateParams, $rootScope, $ionicModal, $location, $state, $window, $ionicActionSheet, $cordovaCamera, $timeout, BrandsServices, MensajesAlerta) {
  $scope.messages = MensajesAlerta.mensajesIdi();

  $rootScope.trendingBottom = -200;
  $rootScope.dragGeneralUp = function(e){
    if(e.gesture.center.pageY >= $window.innerHeight - 140){
      $rootScope.trendingBottom = 10; 
    }

    if(e.gesture.center.pageY >= 0 && e.gesture.center.pageY <=  150 ){
      $rootScope.modalSearch.hide();
    }
  }

  $scope.openOptionPost = false;
  $rootScope.dragOptionsPostUp = function(e){
    if(e.gesture.center.pageY >= $window.innerHeight - 140){
      if (!$scope.openOptionPost) {
        $scope.openOptionPost = true;
        $scope.hideSheet = $ionicActionSheet.show({
          buttons: [
            { text: $scope.messages['textSeleccionarFoto'] },
            { text: $scope.messages['textSeleccionarVideo'] },
          ],
          titleText: $scope.messages['textSeleccionarTitulo'],
          cancelText: $scope.messages['textCancelar'],
          buttonClicked: function(index) {
            $scope.addImagePerfil(index);
          },
          cancel: function() {
            $scope.openOptionPost = false;
          },
        });
      }
    }
  }

  $scope.addImagePerfil = function(type, i) {
    $scope.hideSheet();
    if ( type == 0 ) {
      $scope.source = Camera.PictureSourceType.SAVEDPHOTOALBUM;
      $scope.destination = Camera.DestinationType.DATA_URL;
      $scope.quality = 90;
      $scope.mediaType = Camera.MediaType.PICTURE;
    }else if ( type == 1 ) {
      $scope.source = Camera.PictureSourceType.PHOTOLIBRARY;
      $scope.destination = Camera.DestinationType.FILE_URI;
      $scope.quality = 50;
      $scope.mediaType = Camera.MediaType.VIDEO;
    }

    $scope.options = {
      sourceType: $scope.source,
      destinationType: $scope.destination,
      quality: $scope.quality,
      mediaType: $scope.mediaType,
      saveToPhotoAlbum: false
    }
    $cordovaCamera.getPicture($scope.options).then(function(response) {
      console.log("SUCCESS PHOTO O VIDEO: " + JSON.stringify(response));
      if ( type == 0 ) {
        $rootScope.imagePhoto = 'data:image/jpeg;base64,' + response;
        $rootScope.videoPost = '';
        $timeout(function() {
          $location.path('/post-comment/'+$stateParams.id+'/'+$stateParams.name);
        }, 200);
      }else if ( type == 1 ) {
        VideoEditor.getVideoInfo(
            getVideoInfoSuccess,
            getVideoInfoError,
            {
                fileUri: 'file:'+response
            }
        );

        VideoEditor.createThumbnail(
                createThumbnailSuccess,
                createThumbnailError,
                {
                    fileUri: 'file:'+response,
                    outputFileName: 'video',
                    width: 320,
                    height: 480,
                    quality: 100
                }
            );

        function getVideoInfoSuccess(info) {
            console.log('getVideoInfoSuccess, info: ' + JSON.stringify(info, null, 2));
            if ( info["duration"] < 16 ){
                 $rootScope.videoPost = response;
                 $rootScope.imagePhoto = '';
                 $timeout(function() {
                   $location.path('/post-comment/'+$stateParams.id+'/'+$stateParams.name);
                 }, 200);
            }else{
                 // Error duration mayor que 15 Segundos
            }
        }

        function getVideoInfoError(error) {
            console.log('getVideoInfoError, error: ' + JSON.stringify(error, null, 2));
        }

        function createThumbnailSuccess(result) {
            // result is the path to the jpeg image on the device
            $rootScope.imagePhotoVideo = result;
            console.log('createThumbnailSuccess, result: ' + result);
        }

        function createThumbnailError(result) {
          console.log('createThumbnailError, result: ' + result); 
        }
        
      }
    });

    // ImageServicePerfil.handleMediaDialog(type, i).then(function() {
    //   $scope.$apply();
    // });
  }

  $rootScope.dragGeneralDown = function(e){
    if(e.gesture.center.pageY >= $window.innerHeight - 140){
      $rootScope.trendingBottom = -200; 
    }

    if(e.gesture.center.pageY >= 0 && e.gesture.center.pageY <= 150 ){
      if (!$scope.unavez) {
        $scope.unavez = true;
        $rootScope.modalSearch.show();
      }
    }
  }

  //Search
  $scope.data = {
    buscador: '',
    // marcas: [
    //           { id: 1, img: 'img/br-apple.jpg', nombre: 'Apple' },
    //           { id: 2, img: 'img/br-cocacola.jpg', nombre: 'coca cola' },
    //           { id: 3, img: 'img/br-nike.jpg', nombre: 'nike' },
    //           { id: 4, img: 'img/br-cocacola.jpg', nombre: 'coca cola' },
    //           { id: 5, img: 'img/br-apple.jpg', nombre: 'Apple' },
    //           { id: 6, img: 'img/br-nike.jpg', nombre: 'nike' }
    //         ]
  }

  $scope.unavez = false;
  $ionicModal.fromTemplateUrl('templates/search.html'+ver, {
    scope: $scope,
    animation: 'slide-in-down'
  }).then(function(modal) {
    $rootScope.modalSearch = modal;
  });

  // buscador
  $scope.cargarMas = true;
  $scope.traerMas = true;
  $scope.ejecutar = true;
  $rootScope.searchBrand = function(){
    $scope.array = [];
    $scope.data.marcas = [];

    if ($scope.ejecutar) {
      $scope.ejecutar = false;
      $timeout(function() {
        $scope.enviar = {};
        $scope.enviar['search'] = $scope.data.search;
        $scope.enviar['array'] = $scope.data.array;
        BrandsServices.actionsPost('buscarBrands', $scope.enviar).then(function(json) {
          $scope.ejecutar = true;
          $scope.data.matches = json.result['count'];
          $scope.data.people = json.result['cpeople'];
          $scope.data.brands = json.result['cbrands'];

          for(i in json.result["brands"] ){
            $scope.data.marcas.push(json.result["brands"][i]);
            $scope.array.push(json.result["brands"][i]["id"]);
            if (i == json.result["brands"].length - 1) {
              $scope.cargarMas = true;
              $timeout(function() {
                $scope.traerMas = true;
              }, 2000);
            }
          }
        });
      }, 1000);
    }
  }

  $rootScope.irWatchPost = function(marca){
    $rootScope.modalSearch.hide();
    $location.path( '/watch-post/' + marca.id );
    BrandsServices.actionsPost('sumarTrendingBrand', { id : marca.id, puntos: 'busqueda' }).then(function(json){});
  }

  $rootScope.cargarBrands = function(){
    BrandsServices.actionsPost('buscarBrands', [$scope.data.search, $scope.array]).then(function(json) {
      $scope.data.matches = json.result['count'];
      $scope.data.people = json.result['cpeople'];
      $scope.data.brands = json.result['cbrands'];

      if (json.result["brands"][0]) {
        for(i in json.result["brands"] ){
          $scope.data.brands.push(json.result["brands"][i]);
          $scope.array.push(json.result["brands"][i]["id"]);
          if (i == json.result["brands"].length - 1) {
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.cargarMas = true;
            $timeout(function() {
              $scope.traerMas = true;
            }, 2000);
          }
        }
      }else{
        $scope.traerMas = false;
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }
    });
  }
  
  $rootScope.cargarMasBrands = function(){
    $timeout(function() {
      console.log('cargarMasBrands');
      if ($scope.cargarMas) {
        console.log('cargarMas');
        $scope.cargarBrands();
      }else{
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }
    }, 1000);
  }

  $rootScope.limpiarBuscador = function(){
    $scope.data.search = '';
  }

  $rootScope.follow = function(marca, estado){
    BrandsServices.actionsPost('changeFollow', { id: marca.id, estado: estado } ).then(function(json) {
      if ( estado ) {
        marca.following = true;
      }else{
        marca.following = false;
      }
      marca.follow = json.result['follow'];
    });
  }

  $rootScope.dragSearchDown = function(e){
    console.log(e); 
    if(e.gesture.center.pageY >= 0 && e.gesture.center.pageY <= 150 ){
      if (!$scope.unavez) {
        $scope.unavez = true;
        $rootScope.modalSearch.show();
      }
    }
  }

  $scope.$on('modal.hidden', function() {
      // Execute action
      $scope.unavez = false;
  });

  $rootScope.cerrarModal = function(){
    $rootScope.modalSearch.hide();
  }

  $rootScope.dragSearchUp = function(e){
    if(e.gesture.center.pageY >= 0 && e.gesture.center.pageY <=  150 ){
      $rootScope.modalSearch.hide();
    }
  }

  $rootScope.dragPerfilLeft = function(){
    // console.log('dragPerfilLeft');
  }

  $scope.unavezPerfil = false;
  $rootScope.dragPerfilRight = function(e){
    if(e.gesture.center.pageX <= 100 ){
      if (!$scope.unavezPerfil) {
        $scope.unavezPerfil = true;
        $location.path('/user-profile');
      }
    }
  }

})