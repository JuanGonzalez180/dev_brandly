angular.module('brandly.ctrPerfil', ['ionic', 'ngCordova'])

.controller('PerfilCtrl', function($scope, $stateParams, $window, $location, ionicDatePicker, ngUser, user, UsuariosServices, ageDate, TermsServices){
  $scope.terms = TermsServices.getTerms();

  //Mostrar como vienen
  if (angular.isObject(user.get('usuario_brandly'))) {
      ngUser.$restore(user.get('usuario_brandly'));
  } else {
      ngUser.init();
  }

  $scope.user = ngUser.getUser();
  console.log($scope.user);
  $scope.data = {};

  $scope.calendar = function(){
    var fecha = ''
    var ipObj1 = {
      // inputDate: fecha_nacimiento,
      //dateFormat: 'd-MMMM-yyyy',
      //to: new Date(parseInt($scope.fecha_limite_anho), parseInt($scope.fecha_limite_mes)-1, parseInt($scope.fecha_limite_dia)),
      to: new Date().toISOString(),
      callback: function (val) {
        var date = new Date(val);
        var day = date.getDate();
        var monthIndex = date.getMonth() + 1;
        var year = date.getFullYear();

        if (day<10)
          day = "0"+day;

        if (monthIndex<10)
          monthIndex = "0"+monthIndex;

        $scope.data.fecha_nacimiento = day+"/"+monthIndex+"/"+year;
        $scope.fecha_nacimiento_mes = monthIndex;
        $scope.fecha_nacimiento_anho = year;
        $scope.fecha_nacimiento_dia = day;

        $scope.user.birthday = $scope.data.fecha_nacimiento;
        $scope.user.age = ageDate.calcularEdad($scope.data.fecha_nacimiento);

        UsuariosServices.actionsPost('saveBirthday', $scope.user).then(function(json) {
          if(typeof(json.result["success"])!="undefined" && json.result["success"]){
            // Guardar localmente
            ngUser.$save();
          }
        });

      },
      templateType: 'popup'       //Optional
    };

    if ($scope.user.birthday) {
      var fecha = $scope.user.birthday.split('/');
      ipObj1['inputDate'] = new Date(parseInt(fecha[2]), parseInt(fecha[1])-1, parseInt(fecha[0]));
    }

    ionicDatePicker.openDatePicker(ipObj1);
  }

  $scope.logout = function(){
    // logout
    $window.localStorage["brandly_token"] = '';
    $window.localStorage["brandly_usuType"] = '';
    $window.localStorage['usuario_brandly'] = '';
    $location.path('/login');
  }
})