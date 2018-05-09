angular.module('brandly.ctrLogin', ['ionic', 'ngCordova'])

.controller('LoginCtrl', function($scope, $location, $ionicPopup, $ionicModal, $window, ngFB, UsuariosServices, BrandsServices, MensajesAlerta, ngUser, PaisesServices, TermsServices) {
  // Cargamos Textos
  PaisesServices.traerPaises();
  TermsServices.traerTerms();

  UsuariosServices.actionsPost('validateLogin', {}).then(function(json){
    if(typeof(json.result["success"])!="undefined" && json.result["success"]){
      $location.path('/scan-brand');
    }
  })

  $scope.data = {
    buscador: '',
    marcas: [
              { id: 1, img: 'img/br-apple.jpg', nombre: 'Apple' },
              { id: 2, img: 'img/br-cocacola.jpg', nombre: 'coca cola' },
              { id: 3, img: 'img/br-nike.jpg', nombre: 'nike' }
            ],

    username : '',
    name : '',
    email : '',
    password : '',
    passwordRepeat : '',
  }

  $scope.error = {
    username: '',
    password: '',
  }

  $scope.tab = function(value){
    $scope.forgotPass = false;
    if (value == 1) {
      $scope.tabSign = true;
      $scope.data["registerType"] = 'email';
      $scope.data["rsId"] = '';
      $scope.data["username"] = '';
    }else{
      $scope.tabSign = false;
      $scope.data["username"] = '';
      $scope.error['username'] = '';
    }
    $scope.data["password"] = '';
    $scope.error['password'] = '';
  }

  $scope.activeForgotPass = function(){
    // $scope.forgotPass = true;
    var myPopupPass = $ionicPopup.show({
      templateUrl: 'templates/recuperar-contrasena.html'+ver,
      cssClass: 'popup-which',
      title: '',
      subTitle: $scope.message,
      scope: $scope,
      buttons: [
      ]
    });

    $scope.cerrarPopupPass = function(){
      myPopupPass.close();
    }

    $scope.submitPassword = function(){
      UsuariosServices.actionsPost('changePasswordTemp', $scope.data).then(function(json) {
        if(typeof(json.result["success"])!="undefined" && json.result["success"]){
          MensajesAlerta.mensaje('Message', json.result["message"]);
          myPopupPass.close();
        }else{
          $scope.mensaje = '';
          var j = 0;
          for(var i in json.result["error"]){
            j++;
            if (json.result["error"][i] != null) {
              $scope.error[i] = 'error-brandly';
              $scope.mensaje += json.result["error"][i] + "<br>";
            }
            if (j == Object.keys(json.result["error"]).length) {
              MensajesAlerta.mensaje('Error', $scope.mensaje);
            }
          }
        }
      });

    }
  }

  $scope.login = function(){
    //Temporal
    UsuariosServices.actionsPost('loginUser', $scope.data).then(function(json) {
      if(typeof(json.result["success"])!="undefined" && json.result["success"]){
        $window.localStorage['brandly_token'] = json.result['token'];
        $window.localStorage['brandly_usuType'] = $scope.data["registerType"];
        $location.path('/scan-brand');
        ngUser.loadUser();
      }else{
        $scope.mensaje = '';
        var j = 0;
        for(var i in json.result["error"]){
          j++;
          if (json.result["error"][i] != null) {
            $scope.error[i] = 'error-brandly';
            $scope.mensaje += json.result["error"][i] + "<br>";
          }
          if (j == Object.keys(json.result["error"]).length) {
            MensajesAlerta.mensaje('Error', $scope.mensaje);
          }
        }
      }
    });
  }

  $scope.sigin = function(){
    $scope.perfil = true;

    if (!$scope.data['username']) {
      $scope.error['username'] = 'error-brandly';
      $scope.perfil = false;
    }else{
      $scope.error['username'] = '';
    }

    if (!$scope.data['name']) {
      $scope.error['name'] = 'error-brandly';
      $scope.perfil = false;
    }else{
      $scope.error['name'] = '';
    }

    if (!$scope.data['email']) {
      $scope.error['email'] = 'error-brandly';
      $scope.perfil = false;
    }else{
      $scope.error['email'] = '';
    }

    if ($scope.data["registerType"] == 'email') {
      if (!$scope.data['password']) {
        $scope.error['password'] = 'error-brandly';
        $scope.perfil = false;
      }else{
        $scope.error['password'] = '';
      }

      if (!$scope.data['passwordRepeat']) {
        $scope.error['password'] = 'error-brandly';
        $scope.perfil = false;
      }else{
        $scope.error['password'] = '';
      }

      if ($scope.data['password'] != $scope.data['passwordRepeat'] || !$scope.data['passwordRepeat']) {
        $scope.error['password'] = 'error-brandly';
        $scope.perfil = false;
      }else{
        $scope.error['password'] = '';
      }
    }

    //Guardar Usuario
    UsuariosServices.actionsPost('registerUser', $scope.data).then(function(json) {
      if(typeof(json.result["success"])!="undefined" && json.result["success"]){
        $window.localStorage['brandly_token'] = json.result['token'];
        $window.localStorage['brandly_usuType'] = $scope.data["registerType"];
        $location.path('/scan-brand');
        ngUser.loadUser();
      }else{
        $scope.mensaje = '';
        var j = 0;
        for(var i in json.result["error"]){
          j++;
          if (json.result["error"][i] != null) {
            $scope.error[i] = 'error-brandly';
            $scope.mensaje += json.result["error"][i] + "<br>";
          }
          if (j == Object.keys(json.result["error"]).length) {
            MensajesAlerta.mensaje('Error', $scope.mensaje);
          }
        }
      }
    });
  }

  //con facebook
  $scope.iniciarFacebook = function(){
   ngFB.login({ scope: 'email, public_profile', return_scopes: true }).then(
    function (response) {
     if (response.status === 'connected') {
       ngFB.api({
         method: 'GET',
         path: '/me',
         params: {
           fields: "email, id, name, first_name, last_name"
         }
       }).then(function(user) {
         $scope.data["registerType"] = 'facebook';
         $scope.data['email'] = user['email'];
         $scope.data['rsId'] = user['id'];
         $scope.data['name'] = user['first_name'] + " " + user['last_name'];

         UsuariosServices.actionsPost('revisarRegistrado', $scope.data).then(function(json) {
           if(typeof(json.result["success"])!="undefined" && json.result["success"]){
             if (json.result["registrado"] == 'no') {
              $scope.tabSign = true;
              $scope.forgotPass = false;
             }else{
              $window.localStorage['brandly_token'] = json.result['token'];
              $window.localStorage['brandly_usuType'] = $scope.data["registerType"];
              $location.path('/scan-brand');
              ngUser.loadUser();
             }
           }
         });

       },errorHandler);
    }
   });
  }

  //Modal
  $scope.openModal = function(){
    $scope.marcaBrand = false;
    $scope.okBrand = false;
    var myPopup = $ionicPopup.show({
      templateUrl: 'templates/are-you-brand.html'+ver,
      cssClass: 'popup-which',
      title: '',
      subTitle: $scope.message,
      scope: $scope,
      buttons: [
      ]
    });

    $scope.cerrarPopup = function(){
      myPopup.close();
    }

    $scope.marcaClick = function(marca){
      $scope.marcaBrand = true;
      $scope.marcaActive = marca;
    }

    $scope.submit = function(){
      $scope.okBrand = true;
    }
  }

  //Crear Marca Nueva
  $scope.brandsType = {
    offset: 0,
    limit: 10
  }
  $scope.data.create = {
    step: 1
  }
  //$scope.parametros.offset = $scope.tiendas.length;
  BrandsServices.postBrands('traerBrands', $scope.brandsType);

  $scope.openModalCreateBrand = function(){
    $scope.cerrarPopupBrand = function(){
      myPopupBrands.close();
    }

    $scope.seleccionarTipo = function(){
      $scope.estados = BrandsServices.getBrands();

      $scope.selectTitulo = "Select Type";
      var myPopupEstados = $ionicPopup.show({
        cssClass: 'popup-select',
        scope: $scope,
        templateUrl: 'templates/lista-opciones.html'+ver
      });

      $scope.cerrarPopupList = function(){
        myPopupEstados.close();
      }

      $scope.seleccionarPedidos = function(){
        $scope.data.create.step = 2;
        myPopupEstados.close();
      }

      $scope.brandsCategories = {
        offset: 0,
        limit: 100,
      }
      $scope.seleccionarCategoria = function(){
        $scope.brandsCategories.typebrand = $scope.data.estado;
        BrandsServices.actionsPost('traerBrandsCategory', $scope.brandsCategories).then(function(json) {
          $scope.categorias = json.result["brandsCategory"];
          
          $scope.selectTitulo = "Select Categoty";
          var myPopupCategorias = $ionicPopup.show({
            cssClass: 'popup-select',
            scope: $scope,
            templateUrl: 'templates/lista-opciones-categoria.html'+ver
          });
          $scope.cerrarPopupList = function(){
            myPopupCategorias.close();
            if ($scope.data.estado == "lugar") {
              $scope.data.lug_categoria = $scope.data.categoria.nombre;
            }else if ($scope.data.estado == "empresa") {
              $scope.data.emp_categoria = $scope.data.categoria.nombre;
            }else if ($scope.data.estado == "marca") {
              $scope.data.mar_categoria = $scope.data.categoria.nombre;
            }else if ($scope.data.estado == "artista") {
              $scope.data.art_categoria = $scope.data.categoria.nombre;
            }else if ($scope.data.estado == "entretenimiento") {
              $scope.data.ent_categoria = $scope.data.categoria.nombre;
            }
          }
        });
      }
    }

    var myPopupBrands = $ionicPopup.show({
      templateUrl: 'templates/create-you-brand.html'+ver,
      cssClass: 'popup-which',
      title: '',
      subTitle: $scope.message,
      scope: $scope,
      buttons: [
      ]
    });

    $scope.validarBrand = function(){
      BrandsServices.actionsPost('validarBrand', $scope.data).then(function(json) {
        if(typeof(json.result["success"])!="undefined" && json.result["success"]){
          $scope.data.create.step = 3;
        }else{
          $scope.mensaje = '';
          var j = 0;
          for(var i in json.result["error"]){
            j++;
            if (json.result["error"][i] != null) {
              $scope.error[i] = 'error-brandly';
              $scope.mensaje += json.result["error"][i] + "<br>";
            }
            if (j == Object.keys(json.result["error"]).length) {
              MensajesAlerta.mensaje('Error', $scope.mensaje);
            }
          }
        }
      });
    }

    // Crear Marca.
    $scope.createBrand = function(){
      BrandsServices.actionsPost('registerBrand', $scope.data).then(function(json) {
        if(typeof(json.result["success"])!="undefined" && json.result["success"]){
          // MensajesAlerta.mensaje('Message', json.result["message"]);
          myPopupBrands.close();
          $window.localStorage['brandly_token'] = json.result['token'];
          $window.localStorage['brandly_usuType'] = $scope.data["registerType"];
          $location.path('/scan-brand');
          ngUser.loadUser();
        }else{
          $scope.mensaje = '';
          var j = 0;
          for(var i in json.result["error"]){
            j++;
            if (json.result["error"][i] != null) {
              $scope.error[i] = 'error-brandly';
              $scope.mensaje += json.result["error"][i] + "<br>";
            }
            if (j == Object.keys(json.result["error"]).length) {
              MensajesAlerta.mensaje('Error', $scope.mensaje);
            }
          }

          // 
        }
      });
    }
  }
})

