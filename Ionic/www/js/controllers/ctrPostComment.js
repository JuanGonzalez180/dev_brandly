angular.module('brandly.ctrPostComment', ['ionic', 'ngCordova'])

.controller('PostCommentCtrl', function($scope, $stateParams, $location, $rootScope, $window, BrandsServices, ngUser, $cordovaFileTransfer, CONFIG){
  $scope.user = ngUser.getUser();

  $scope.irPost = function(){
    $location.path('/post/'+$stateParams.id+'/'+$stateParams.name);
  }

  $scope.id = $stateParams.id;
  $scope.height = $window.innerHeight;
  $scope.estadoEnvio = true;
  $scope.savePost = function(){
    // $rootScope.imagePhoto
    // $rootScope.videoPost
    //$scope.message
    // Guardar Imagen
    // Guardar Video
    //#/watch-dos/{{id}}
    if ( $scope.estadoEnvio ){
      $scope.estadoEnvio = false;

      if ($rootScope.imagePhoto) {
        $scope.data = {
          video: $rootScope.videoPost,
          imagen: $rootScope.imagePhoto,
          comentario: $scope.message,
          id: $stateParams.id,
        }
        BrandsServices.actionsPost('createPost', $scope.data).then(function(json){
          if(typeof(json.result["success"])!="undefined" && json.result["success"]){
              $rootScope.imagePhoto = '';
              $scope.message = '';
              $location.path('/watch-dos/'+$scope.id);
          }else{
            $scope.estadoEnvio = true;
          }
        })
      }

      // 
      if ($rootScope.videoPost) {
          $scope.imagePhotoVideo = 'img/loading.jpg';
          if ($rootScope.imagePhotoVideo) {
            $scope.imagePhotoVideo = $rootScope.imagePhotoVideo;
          }

          var options = {
              fileKey: "postvideo",
              fileName: "filename.mp4",
              chunkedMode: false,
              mimeType: "video/mp4",
              params: {
                  comentario: $scope.message,
                  id: $stateParams.id,
                  token: $window.localStorage["brandly_token"],
                  type: 'createPost',
                  video: true,
              }
          };

          $cordovaFileTransfer.upload(CONFIG.url+'webservices/brands/uploadVideo.php', $rootScope.videoPost, options)
                .then(function(json) {
                  // Success!
                  console.log("SUCCESS: " + JSON.stringify(json));
                  $scope.widthProgress = 0;
                   if(typeof(json.response.result["success"])!="undefined" && json.response.result["success"]){
                      $rootScope.videoPost = '';
                      $scope.message = '';
                      $location.path('/watch-dos/'+$scope.id);
                   }else{
                    $scope.estadoEnvio = true;
                   }
                }, function(err) {
                  // Error
                  // console.log("ERROR: " + JSON.stringify(err));
                  $scope.estadoEnvio = true;
                }, function (progress) {
                  // constant progress updates
                  console.log("PROGRESS: " + JSON.stringify(progress));
                  if (progress.lengthComputable) {
                    $scope.widthProgress = (progress.loaded / progress.total) * 100;
                  } else {
                    // loadingStatus.increment();
                  }
                });
      }
    }
  }
})