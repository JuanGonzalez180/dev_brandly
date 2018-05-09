angular.module('brandly.ctrScanBrand', ['ionic', 'ngCordova'])

.controller('ScanBrandCtrl', function($scope, $location, $ionicModal, $http, $window, $timeout, $cordovaFile, $cordovaFileTransfer, $cordovaCamera, $cordovaClipboard, $ionicPlatform, $ionicPopup, $ionicLoading, BrandsServices, MensajesAlerta, UsuariosServices){
  $scope.messages = MensajesAlerta.mensajesIdi();
  $scope.itemsScan = {};

  $ionicPlatform.ready(function() {
    if (ionic.Platform.platforms[0] != 'browser') {
      var me = this;
      $scope.current_image = '';
      $scope.image_description = '';
      $scope.detection_type = 'LABEL_DETECTION';

      $scope.detection_types = {
        LABEL_DETECTION: 'label',
        TEXT_DETECTION: 'text',
        LOGO_DETECTION: 'logo',
        LANDMARK_DETECTION: 'landmark'
      };

      // $scope.api_key = 'AIzaSyDUpTl3wo2Q5qEJSvq5_8mkBP-1pUKtUH0';
      $scope.api_key = 'AIzaSyAdvLQP1qXVBpRif5qjxzl0ho7DjnXI7pc';

      $scope.irWatchPost = function(marca){
        if (marca.id) {
          $location.path( '/watch-post/' + marca.id );
          BrandsServices.actionsPost('sumarTrendingBrand', { id : marca.id, puntos: 'busqueda' }).then(function(json){});
        }
      }

      $scope.clickEscaneadas = function(items){
        //$scope.itemsLogos = items;
        $scope.mostrarPopup = false;
        $scope.notfoundServer = false;
        $scope.notfound = false;
        //Buscamos las marcas que existan en nuestra base de datos...
        $scope.itemsScan['brands'] = items;

        // Probando el escaneo de google app
        // if (items) {
        //     if ( items.length >= 1 ) {
        //         console.log(JSON.stringify(items,null, 4));
        //         $scope.itemsLogos = items;
        //         $scope.mostrarPopup = true;
        //     }else{
        //         console.log('no ingresó');
        //         $scope.notfoundServer = true;
        //         $scope.mostrarPopup = true;
        //     }
        // }else{
        //     console.log('no items');
        //     $scope.notfound = true;
        //     $scope.mostrarPopup = true;
        // }

        // if ($scope.mostrarPopup) {
        //    var myPopupBrands = $ionicPopup.show({
        //      templateUrl: 'templates/google-results.html'+ver,
        //      cssClass: 'popup-which',
        //      title: '',
        //      subTitle: $scope.message,
        //      scope: $scope,
        //      buttons: [
        //      ]
        //    });
        //    $scope.cerrarPopupBrands = function(){
        //      myPopupBrands.close();
        //    }
        // }

        // Cuando exista en BD de Brandly
        // BrandsServices.actionsPost('getBrandsScan', $scope.itemsScan).then(function(json) {
        //     if (items) {
        //         if( json.result["count"] == 1 ){
        //             $scope.irWatchPost( json.result["brands"][0] );
        //             CameraPreview.stopCamera();
        //         }else if ( json.result["count"] > 1 ) {
        //             $scope.itemsLogos = json.result["brands"];
        //             $scope.mostrarPopup = true;
        //         }else{
        //             $scope.notfoundServer = true;
        //             $scope.mostrarPopup = true;
        //         }
        //     }else{
        //         $scope.notfound = true;
        //         $scope.mostrarPopup = true;
        //     }

        //     if ($scope.mostrarPopup) {
        //        var myPopupBrands = $ionicPopup.show({
        //          templateUrl: 'templates/google-results.html'+ver,
        //          cssClass: 'popup-which',
        //          title: '',
        //          subTitle: $scope.message,
        //          scope: $scope,
        //          buttons: [
        //          ]
        //        });
        //        $scope.cerrarPopupBrands = function(){
        //          myPopupBrands.close();
        //        }
        //     }
        // });

        // Combinado
        BrandsServices.actionsPost('getBrandsScan', $scope.itemsScan).then(function(json) {
          if (items) {
              if ( items.length >= 1 ) {
                  console.log(JSON.stringify(items,null, 4));
                  console.log(JSON.stringify(json.result["brands"],null, 4));
                  
                  for( iBrand in json.result["brands"]){
                    for(iBrandGoogle in items){
                      if(json.result["brands"][iBrand]['name'] == items[iBrandGoogle]['description']){
                        items[iBrandGoogle]["id"] = json.result["brands"][iBrand]['id'];
                        items[iBrandGoogle]["img"] = json.result["brands"][iBrand]['img'];
                      }
                    }
                    if (iBrand == json.result["brands"].length - 1) {
                      $scope.itemsLogos = items; 
                    }
                  }
                  $scope.mostrarPopup = true;
              }else{
                  console.log('no ingresó');
                  $scope.notfoundServer = true;
                  $scope.mostrarPopup = true;
              }
          }else{
              console.log('no items');
              $scope.notfound = true;
              $scope.mostrarPopup = true;
          }

          if ($scope.mostrarPopup) {
             var myPopupBrands = $ionicPopup.show({
               templateUrl: 'templates/google-results.html'+ver,
               cssClass: 'popup-which',
               title: '',
               subTitle: $scope.message,
               scope: $scope,
               buttons: [
               ]
             });
             $scope.cerrarPopupBrands = function(){
               myPopupBrands.close();
             }
          }
        });

      }
      // $scope.clickEscaneadas();

      let options = {
        x: 0,
        y: 0,
        width: $window.screen.width,
        height: $window.screen.height,
        camera: CameraPreview.CAMERA_DIRECTION.BACK,
        toBack: true,
        tapPhoto: true,
        tapFocus: false,
        previewDrag: false
      };

      $scope.successStart = function(success){
      }

      $scope.errorStart = function(error){
      }

      CameraPreview.startCamera(options, $scope.successStart, $scope.errorStart);

      $scope.takeStatus = true;
      $scope.takePicture = function(){
        if ($scope.takeStatus) {
          $ionicLoading.show();

          $scope.takeStatus = false;
          CameraPreview.takePicture(function(imagedata){
            $timeout(function() {
              $scope.current_image = "data:image/jpeg;base64," + imagedata[0];
              $scope.image_description = '';
              $scope.locale = '';

              $scope.vision_api_json = {
                "requests":[
                  {
                    "image":{
                      "content": imagedata[0]
                    },
                    "features":[
                      {
                        "type": 'LOGO_DETECTION'
                      },
                      {
                        "type": 'WEB_DETECTION'
                      }
                    ]
                  }
                ]
              }

              console.log('$http.post');
              // $http.post('https://vision.googleapis.com/v1/images:annotate?key=' + $scope.api_key, $scope.vision_api_json, { headers: { "NoAuthToken": true, "Accept": "application/json, text/plain, */*", "Content-Type": "application/json;charset=utf-8" }} )
              $http.post('https://vision.googleapis.com/v1/images:annotate?key=' + $scope.api_key, $scope.vision_api_json)
              .then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available

                $scope.takeStatus = true;
                $ionicLoading.hide();

                // alert(JSON.stringify(response["data"]['responses'][0]['logoAnnotations']));
                // alert(JSON.stringify(response['responses'][0]['logoAnnotations']));

                var arrayLogos = response['data']['responses'][0]['logoAnnotations'];
                var arrayWebs = response['data']['responses'][0]['webDetection']['webEntities'];
                var arrayAll;
                if ( arrayLogos == undefined || arrayLogos == "undefined" ) {
                    arrayAll = arrayWebs;
                }else if ( arrayWebs == undefined || arrayWebs == "undefined" ) {
                    arrayAll = arrayLogos;
                }else{
                    arrayAll = arrayLogos.concat(arrayWebs);
                }

                $scope.clickEscaneadas(arrayAll);
                // alert(JSON.stringify(arrayAll));
                // alert(JSON.stringify(response));

                //$scope.clickEscaneadas(response['responses'][0]['logoAnnotations']);
                //$scope.$apply();
              }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.takeStatus = true;
                $ionicLoading.hide();
                // alert(JSON.stringify(response));
                alert('Error occurred when scanning the brand');
                //$scope.$apply();
              });
            }, 500);
          });
        }
      }

      $scope.tomarFotoNueva = function(){
        $ionicPlatform.ready(function() {
          if (ionic.Platform.platforms[0] != 'browser') {
            $scope.takePicture();
          }
        });
      }
      // $scope.tomarFotoNueva();
    }

    $scope.actionNotifications = function(){
      console.log('actionNotifications'); 
      $location.path('/notifications/scan-brand');
    }

  });
})