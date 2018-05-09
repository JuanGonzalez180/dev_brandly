angular.module('brandly.services', [])

.constant('CONFIG', {
  url: 'http://brandly.repositorios.co/'
  // url: 'https://brandly.com/',
})

.factory('MensajesAlerta', function($http, $q, $ionicPopup) {
  var mensajesIdioma = {
    success: 'Se ha guardado satisfactoriamente',
    notfound: 'No se encontraron resultados de la imagen',
    notfoundServer: 'No se encontrar resultados en nuestra base de datos',
    textFotoPerfil: 'Tomar Foto Perfil',
    textFotoPerfil2: 'Seleccionar Foto Perfil',
    textFotoAlbum: 'Tomar Foto Portada',
    textFotoAlbum2: 'Seleccionar Foto Portada',
    textAnadirFoto: 'Añadir Foto',
    textCancelar: 'Cancelar',
    guardandoImage: 'Guardando imagen',
    textSeleccionarFoto: 'Seleccionar Foto',
    textSeleccionarVideo: 'Seleccionar Video',
    textSeleccionarTitulo: 'Añadir Foto o Video',
  };

  return{
    mensaje: function(titulo, descripcion){
      $ionicPopup.show({
        template: '',
        class: 'popup-container',
        title: titulo,
        subTitle: descripcion,
        buttons: [
          { text: 'Ok' }
        ]
      });
    },
    mensajesIdi: function(){
      return mensajesIdioma;
    }
  }
})

.factory('BrandsServices', function($http, $q, $ionicLoading, $window, CONFIG, $ionicPlatform, $location, $rootScope) {
  var brandsType = [];
  
  return {
    postBrands: function(type,datos){
      brandsType = [];
      datos["type"] = type;
      
      console.log(datos);
      $http.post(CONFIG.url+'webservices/brands/brands.php', datos)
      .success(function(response, status){
        if (response.result) {
          if (response.result["brands"]) {
            for (i in response.result["brands"]) {
              brandsType.push(response.result["brands"][i]);
            };
          }
        }
      })
      .error(function(data, status, headers, config) {
      });
    },
    getBrands: function() {
      return brandsType;
    },
    actionsPost: function(type,datos){
      var deferred = $q.defer();

      datos["token"] = $window.localStorage["brandly_token"];
      datos["usuType"] = $window.localStorage["brandly_usuType"];
      datos["accessTokenBrandlyIncdustry"] = $window.localStorage["accessTokenBrandlyIncdustry"];
      datos["platform"] = ionic.Platform.platform();
      datos["model"] = device.model;
      datos["type"] = type;

      // usuario
      console.log(datos);
      //alert(JSON.stringify(datos,null, 4));
      $http.post(CONFIG.url+'webservices/brands/brands.php', datos)
      .success(function(response, status){
        deferred.resolve(response);
      })
      .error(function(data, status, headers, config) {
        // errorHttpResponse();
        //$ionicLoading.hide().then(function(){});
      });
      return deferred.promise;
    }
  }
})

.run(['$rootScope', 'ngUser', 'user', function ($rootScope, ngUser, user) {

    $rootScope.$on('ngUser:change', function(){
        ngUser.$save();
    });

    if (angular.isObject(user.get('usuario_brandly'))) {
        ngUser.$restore(user.get('usuario_brandly'));
    } else {
        ngUser.init();
    }

}])

.service('ngUser', ['$rootScope', 'user', 'ageDate', '$window', '$http', 'CONFIG', function ($rootScope, user, ageDate, $window, $http, CONFIG) {
  this.init = function(){
      this.$user = {
          username: null,
          name: null,
          age: null,
          birthday: null,
          mobileNumber: null,
          paisId: null,
          paisName: null,
          email: null,
          registerType: null,
          notifications: 0,
          likes: 0,
          imgPerfil: '',
          imgPortada: '',
      };
  };

  this.loadUser = function(){
    var datos = {};
    var _self = this;
    datos["token"] = $window.localStorage["brandly_token"];
    datos["usuType"] = $window.localStorage["brandly_usuType"];
    datos["type"] = 'loadDataUser';
    $http.post(CONFIG.url+'webservices/usuarios/usuarios.php', datos)
    .success(function(response, status){
      _self.$user.username = response.result.usuarios["username"];
      _self.$user.name = response.result.usuarios["name"];
      _self.$user.email = response.result.usuarios["email"];
      _self.$user.registerType = response.result.usuarios["register_type"];
      _self.$user.birthday = response.result.usuarios["birthday"];
      _self.$user.age = ageDate.calcularEdad(response.result.usuarios["birthday"]);
      _self.$user.mobileNumber = response.result.usuarios["celular"];
      _self.$user.paisId = response.result.usuarios["pais_id"];
      _self.$user.paisName = response.result.usuarios["pais_name"];
      
      _self.$user.imgPerfil = response.result.usuarios["img_perfil"];
      _self.$user.imgPortada = response.result.usuarios["img_portada"];
      _self.$save();
      // calcular
      // this.$user.age;
    })
    .error(function(data, status, headers, config) {
      //error
    });
  }

  this.setUsername = function(username){
      this.$user.username = username;
      return username;
  };

  this.getUsername = function(){
      return this.$user.username;
  };

  this.setName = function(name){
      this.$user.name = name;
      return name;
  };

  this.getName = function(){
      return this.$user.name;
  };

  this.setAge = function(age){
      this.$user.age = age;
      return age;
  };

  this.getAge = function(){
      return this.$user.age;
  };

  this.setBirthday = function(birthday){
      this.$user.birthday = birthday;
      return birthday;
  };

  this.getBirthday = function(){
      return this.$user.birthday;
  };

  this.setMobileNumber = function(mobileNumber){
      this.$user.mobileNumber = mobileNumber;
      return mobileNumber;
  };

  this.getMobileNumber = function(){
      return this.$user.mobileNumber;
  };

  this.setEmail = function(email){
      this.$user.email = email;
      return email;
  };

  this.getEmail = function(){
      return this.$user.email;
  };

  this.setNotifications = function(notifications){
      this.$user.notifications = notifications;
      return notifications;
  };

  this.getNotifications = function(){
      return this.$user.notifications;
  };

  this.setLikes = function(likes){
      this.$user.likes = likes;
      return likes;
  };

  this.getLikes = function(){
      return this.$user.likes;
  };

  this.getUser = function(){
      return this.$user;
  };

  this.$restore = function(saveUser){
      var _self = this;
      _self.init();
      _self.$user.username = saveUser.username;
      _self.$user.name = saveUser.name;
      _self.$user.email = saveUser.email;
      _self.$user.registerType = saveUser.registerType;
      _self.$user.birthday = saveUser.birthday;
      _self.$user.age = ageDate.calcularEdad(saveUser.birthday);
      _self.$user.mobileNumber = saveUser.mobileNumber;
      _self.$user.paisId = saveUser.paisId;
      _self.$user.paisName = saveUser.paisName;
      _self.$user.imgPerfil = saveUser.imgPerfil;
      _self.$user.imgPortada = saveUser.imgPortada;
      // calcular
      // this.$user.age;

      this.$save();
  };

  this.$save = function () {
      return user.set('usuario_brandly', JSON.stringify(this.getUser()));
  };

}])

.service('user', ['$window', function ($window) {
    return {
        get: function (key) {
            if ($window.localStorage [key]) {
                if ($window.localStorage [key] != 'undefined') {
                    var user = angular.fromJson($window.localStorage [key]);
                    return JSON.parse(user);
                }
                return false;
            }
            return false;
        },

        set: function (key, val) {
            if (val === undefined) {
                $window.localStorage .removeItem(key);
            } else {
                $window.localStorage [key] = angular.toJson(val);
            }
            return $window.localStorage [key];
        }
    }
}])

.factory('UsuariosServices', function($http, $q, $ionicLoading, $window, CONFIG, $ionicPlatform, $location, $rootScope, ngUser, MensajesAlerta) {
  var usuario = {};
  var messages = MensajesAlerta.mensajesIdi();
  
  return {
    actionsPost: function(type,datos){
      var deferred = $q.defer();

      datos["token"] = $window.localStorage["brandly_token"];
      datos["usuType"] = $window.localStorage["brandly_usuType"];
      datos["accessTokenBrandlyIncdustry"] = $window.localStorage["accessTokenBrandlyIncdustry"];
      datos["platform"] = ionic.Platform.platform();
      datos["model"] = device.model;
      datos["type"] = type;

      // usuario... quitar al terminar
      console.log(datos);
      $http.post(CONFIG.url+'webservices/usuarios/usuarios.php', datos)
      .success(function(response, status){
        deferred.resolve(response);
      })
      .error(function(data, status, headers, config) {
        // errorHttpResponse();
        //$ionicLoading.hide().then(function(){});
      });
      return deferred.promise;
    },
    guardarImagen: function(type, datos){

      datos["token"] = $window.localStorage["brandly_token"];
      datos["usuType"] = $window.localStorage["brandly_usuType"];
      datos["accessTokenBrandlyIncdustry"] = $window.localStorage["accessTokenBrandlyIncdustry"];
      datos["platform"] = ionic.Platform.platform();
      datos["model"] = device.model;
      datos["type"] = type;
      // datos["file"] = imageUrl;

      $ionicLoading.show({
        template: messages.guardandoImage,
      }).then(function(){
      })

      $http.post(CONFIG.url+"webservices/usuarios/usuarios.php", datos )
                      .then(function (response) {
                        $ionicLoading.hide().then(function(){});
                        if (response.data["result"]["success"]) {
                          var data = {
                            imagen: response.data["result"]["image"]
                          };
                          if ( type == 'guardarImagenPerfil') {
                            $rootScope.$broadcast('modificarImagePerfil', data);
                            if ($window.localStorage['cache']) {
                              $window.localStorage['cache']++;
                            }else{
                              $window.localStorage['cache'] = 1;
                            }
                          }else if ( type == 'guardarImagenPortada') {
                            $rootScope.$broadcast('modificarImagePortada', data);
                            if ($window.localStorage['cachePortada']) {
                              $window.localStorage['cachePortada']++;
                            }else{
                              $window.localStorage['cachePortada'] = 1;
                            }
                          }
                        };
                    });

    },
  }
})

.factory('PaisesServices', function($http, $q, $ionicLoading, $window, CONFIG, $ionicPlatform, $location, $rootScope) {
  var paises = {};

  return {
    traerPaises: function(){
      $http.post(CONFIG.url+'webservices/paises/paises.php', { type : 'getPaises' })
      .success(function(response, status){
        $window.localStorage["paises"] = angular.toJson(response['result']['paises']);
      })
      .error(function(data, status, headers, config) {
        // errorHttpResponse();
      });
    },
    getPaises: function(){
      return angular.fromJson( $window.localStorage["paises"] );
    }
  }
})

.factory('TermsServices', function($http, $q, $ionicLoading, $window, CONFIG, $ionicPlatform, $location, $rootScope) {
  var terms = {};

  return {
    traerTerms: function(){
      $http.post(CONFIG.url+'webservices/terminos/terminos.php', { type : 'getTerminos' })
      .success(function(response, status){
        $window.localStorage["terms_brandly"] = angular.toJson(response['result']);
      })
      .error(function(data, status, headers, config) {
        // errorHttpResponse();
      });
    },
    getTerms: function(){
      return angular.fromJson( $window.localStorage["terms_brandly"] );
    }
  }
})

.factory('ageDate', function(){
  //Calcular edad
  return {
    calcularEdad: function(fecha){
      // Si la fecha es correcta, calculamos la edad
      var values=fecha.split("/");
      var dia = values[0];
      var mes = values[1];
      var ano = values[2];

      // cogemos los valores actuales
      var fecha_hoy = new Date();
      var ahora_ano = fecha_hoy.getYear();
      var ahora_mes = fecha_hoy.getMonth()+1;
      var ahora_dia = fecha_hoy.getDate();

      // realizamos el calculo
      var edad = (ahora_ano + 1900) - ano;
      if ( ahora_mes < mes )
      {
          edad--;
      }
      if ((mes == ahora_mes) && (ahora_dia < dia))
      {
          edad--;
      }
      if (edad > 1900)
      {
          edad -= 1900;
      }

      // calculamos los meses
      var meses=0;
      if(ahora_mes>mes)
          meses=ahora_mes-mes;
      if(ahora_mes<mes)
          meses=12-(mes-ahora_mes);
      if(ahora_mes==mes && dia>ahora_dia)
          meses=11;

      // calculamos los dias
      var dias=0;
      if(ahora_dia>dia)
          dias=ahora_dia-dia;
      if(ahora_dia<dia)
      {
          ultimoDiaMes=new Date(ahora_ano, ahora_mes, 0);
          dias=ultimoDiaMes.getDate()-(dia-ahora_dia);
      }

      if (edad > 0) {
        return edad;        
      }

      return '';
    }
  }
})

.factory('ImageServicePerfil', function($ionicPlatform, $cordovaCamera, $q, $cordovaFile, $cordovaFileTransfer, $window, $http, $location, $rootScope, $timeout) {
  function optionsForType(type,i) {
    var source;
    switch (type) {
      case 0:
      case 2:
        source = Camera.PictureSourceType.CAMERA;
        break;
      case 1:
      case 3:
        source = Camera.PictureSourceType.SAVEDPHOTOALBUM;
        break;
    }
    return {
      destinationType: Camera.DestinationType.DATA_URL,
      quality: 90,
      sourceType: source,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };
  }
 
  function saveMedia(type,i) {
    return $q(function(resolve, reject) {
      $ionicPlatform.ready(function() {
          if (ionic.Platform.platforms[0] != 'browser') {
            var options = optionsForType(type,i);
            //Ir a Comentarios del POST
            $cordovaCamera.getPicture(options).then(function(imageUrl) {
              if ( ( type == 0 || type == 1 ) && i == 'imagenUsuario' ) {
                // Imagen Perfil
                $rootScope.$broadcast('mostrarImagePerfil', imageUrl);
              }else if ( ( type == 2 || type == 3 ) && i == 'imagenUsuario' ) {
                // Imagen Portada
                $rootScope.$broadcast('mostrarImagePortada', imageUrl);
              }
            });
          }
        });
    })
  }
  return {
    handleMediaDialog: saveMedia
  }

})





;
