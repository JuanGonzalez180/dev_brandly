angular.module('brandly.ctrPerfilSet', ['ionic', 'ngCordova'])

.controller('SetUsernameCtrl', function($scope, $stateParams, ngUser, UsuariosServices, MensajesAlerta){
  $scope.mensajes = MensajesAlerta.mensajesIdi();
  console.log($scope.mensajes)
  $scope.user = ngUser.getUser();
  $scope.guardarUsername = function(){
    UsuariosServices.actionsPost('saveUsername', $scope.user).then(function(json) {
      if(typeof(json.result["success"])!="undefined" && json.result["success"]){
        // Guardar localmente
        ngUser.$save();
        MensajesAlerta.mensaje('Message', $scope.mensajes['success']);
      }else{
        $scope.error = json.result.error['username'];
      }
    });
  }
})

.controller('SetNameCtrl', function($scope, $stateParams, ngUser, UsuariosServices, MensajesAlerta){
  $scope.mensajes = MensajesAlerta.mensajesIdi();
  $scope.user = ngUser.getUser();
  $scope.guardarName = function(){
    UsuariosServices.actionsPost('saveName', $scope.user).then(function(json) {
      if(typeof(json.result["success"])!="undefined" && json.result["success"]){
        // Guardar localmente
        ngUser.$save();
        MensajesAlerta.mensaje('Message', $scope.mensajes['success']);
      }else{
        $scope.error = json.result.error['name'];
      }
    });
  }
})

.controller('SetMobileCtrl', function($scope, $stateParams, $location, $ionicPopup, PaisesServices, ngUser, UsuariosServices, MensajesAlerta){
  $scope.mensajes = MensajesAlerta.mensajesIdi();
  $scope.paises = PaisesServices.getPaises();
  $scope.user = ngUser.getUser();
  console.log($scope.user);

  $scope.data = { 
    nacionalidad: { id: '', value: 'País' },
  }
  // $scope.paises = [
  //   { id: 0, value: 'País', checked: true },
  //   { id: 1, value: 'Colombia', checked: false  },
  //   { id: 2, value: 'Panamá', checked: false  },
  // ];

  $scope.clickOption = function(type, select){
    $scope.popup = [];
    if (type == 'nacionalidad') {
      $scope.data.estado = $scope.data.nacionalidad['id'];
      $scope.popup['titulo'] = 'Selecciona el país';
      $scope.popup['opciones'] = $scope.paises;
      $scope.popup['button'] = 'Ok';
      $scope.popup['tipo'] = 'nacionalidad';
    }

    var myPopupEstados = $ionicPopup.show({
      cssClass: 'fondo-total bkg-deg-uku-trans',
      scope: $scope,
      templateUrl: 'templates/listado-opciones.html'+ver
    });

    $scope.cerrarPopup = function(){
      myPopupEstados.close();
    }

    $scope.seleccionarOpcion = function(tipo, opciones){
      if (tipo == 'nacionalidad') {
        for (i in $scope.popup['opciones']) {
          if($scope.popup['opciones'][i]['id'] == $scope.data.estado){
            // $window.localStorage['usuApp'] = $scope.popup['opciones'][i]['id'];
            $scope.user.paisId = $scope.popup['opciones'][i]['id'];
            $scope.user.paisName = $scope.popup['opciones'][i]['value'];
            console.log($scope.data.nacionalidad['value']);
          }
        }
      }
      myPopupEstados.close();
    }
  }

  $scope.guardarMobileNumber = function(){
    UsuariosServices.actionsPost('saveMobileNumber', $scope.user).then(function(json) {
      if(typeof(json.result["success"])!="undefined" && json.result["success"]){
        // Guardar localmente
        ngUser.$save();
        MensajesAlerta.mensaje('Message', $scope.mensajes['success']);
      }else{
        $scope.error = json.result.error['mobileNumber'];
      }
    });
  }
})

.controller('SetEmailCtrl', function($scope, $stateParams, ngUser, UsuariosServices, MensajesAlerta){
  $scope.mensajes = MensajesAlerta.mensajesIdi();
  $scope.user = ngUser.getUser();

  $scope.guardarEmail = function(){
    UsuariosServices.actionsPost('saveEmail', $scope.user).then(function(json) {
      if(typeof(json.result["success"])!="undefined" && json.result["success"]){
        // Guardar localmente
        ngUser.$save();
        MensajesAlerta.mensaje('Message', $scope.mensajes['success']);
      }else{
        $scope.error = json.result.error['email'];
      }
    });
  }
})

.controller('SetPasswordCtrl', function($scope, $stateParams, ngUser, UsuariosServices, MensajesAlerta){
  $scope.mensajes = MensajesAlerta.mensajesIdi();
  $scope.user = ngUser.getUser();
  $scope.data = {};
  
  $scope.guardarPassword = function(){
    UsuariosServices.actionsPost('savePasswordNew', $scope.data).then(function(json) {
      if(typeof(json.result["success"])!="undefined" && json.result["success"]){
        MensajesAlerta.mensaje('Message', $scope.mensajes['success']);
        $scope.data = {};
        $scope.error = '';      
        $scope.error_new = '';      
      }else{
        $scope.error = json.result.error['password'];
        $scope.error_new = json.result.error['passwordNew'];
      }
    });
  }
})