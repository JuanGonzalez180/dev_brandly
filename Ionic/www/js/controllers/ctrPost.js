angular.module('brandly.ctrPost', ['ionic', 'ngCordova'])

.controller('PostCtrl', function($scope, $stateParams, $window, $timeout, $rootScope, $location, $ionicPlatform){
  $scope.backPost = function(){
    $location.path('/'+$stateParams.name+'/'+$stateParams.id);
  }

  $rootScope.videoPost = '';
  $rootScope.imagePhoto = '';
  $ionicPlatform.ready(function() {
      if (ionic.Platform.platforms[0] != 'browser') {

        let options = {
          x: 0,
          y: 0,
          width: $window.screen.width,
          height: $window.screen.height,
          camera: "front",
          toBack: true,
          tapPhoto: true,
          tapFocus: false,
          previewDrag: false
        };

        CameraPreview.startCamera(options);

        $scope.flash = false;
        $scope.changeFlashMode = function(){
          CameraPreview.getFlashMode(function(currentFlashMode){
            if (currentFlashMode == 'off') {
              CameraPreview.setFlashMode(CameraPreview.FLASH_MODE.ON);
              $scope.flash = true;
            }else{
              $scope.flash = false;
              CameraPreview.setFlashMode(CameraPreview.FLASH_MODE.OFF);
            }
          });
        }

        $scope.switchCameraButton = function(){
          CameraPreview.switchCamera();
        }

        $scope.captureSuccessVideo = function(mediaFiles){
          var i, len;
          for (i = 0, len = mediaFiles.length; i < len; i += 1) {
              // Thumbnail Video
              VideoEditor.createThumbnail(
                      createThumbnailSuccess,
                      createThumbnailError,
                      {
                          fileUri: mediaFiles[i].fullPath,
                          outputFileName: 'video',
                          width: 320,
                          height: 480,
                          quality: 100
                      }
                  );

              $rootScope.videoPost = mediaFiles[i].fullPath;
              $rootScope.imagePhoto = '';
              $timeout(function() {
                $location.path('/post-comment/'+$stateParams.id+'/'+$stateParams.name);
              }, 200);

              $scope.$apply();
          }


          if (mediaFiles.length == 0) {
            CameraPreview.startCamera(options);
          }
        }

        function createThumbnailSuccess(result) {
            // result is the path to the jpeg image on the device
            $rootScope.imagePhotoVideo = result;
            console.log('createThumbnailSuccess, result: ' + result);
        }

        function createThumbnailError(result) {
          console.log('createThumbnailError, result: ' + result); 
        }

        $scope.captureErrorVideo = function(error){
          // var msg = 'An error occurred during capture: ' + error.code;
          CameraPreview.startCamera(options);
          // alert(msg);
        }

        $scope.takeVideoButton = function(){
          $timeout(function() {
            CameraPreview.stopCamera();
            // alert('takeVideoButton'); 
            navigator.device.capture.captureVideo(
                $scope.captureSuccessVideo, 
                $scope.captureErrorVideo, 
                {
                  limit: 1,
                  duration: 15,
                  highquality: false,
                  frontcamera: true,
                }
            );
          }, 2000);
        }
        
        $scope.takePictureButton = function(){
          // alert('takePictureButton'); 
          CameraPreview.takePicture(function(imgData){
            console.log('CameraPreview.takePicture'); 
            $rootScope.imagePhoto = 'data:image/jpeg;base64,' + imgData;
            $rootScope.videoPost = '';
            $timeout(function() {
              CameraPreview.stopCamera();
              $location.path('/post-comment/'+$stateParams.id+'/'+$stateParams.name);
            }, 200);
          });
        }
    }
  });
})