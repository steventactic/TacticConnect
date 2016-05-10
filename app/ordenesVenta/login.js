'use strict';

angular.module('myApp.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'ordenesVenta/login.html',
    controller: 'loginCtrl'
  });
}])

.controller('loginCtrl', [ '$scope', 'datatable', '$location','$http', 'Scopes' ,'$mdDialog', function($scope,datatable ,$location  ,$http , Scopes , $mdDialog ) {
    Scopes.store('loginCtrl', $scope);
    console.log("variable global " + hostName) ;
      $scope.login = {};   
      $scope.login.mostrarMenu = false ;
   
    //var t  = $location.path($location.path() + '/getusers');
    //alert($location.absUrl().substr(0, $location.absUrl().lastIndexOf("#")) + "/getusers");
    //alert($location.absUrl());
    //alert($location.host());
    //alert($location.path());
    //alert($location.port());
    //alert($location.protocol());
    var t  = $location.protocol()+"://"+$location.host()+":"+$location.port();
    //alert(t);
     


      


    /* $scope.showConfirm = function(ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
              .title("Logueado como '"+ window.localStorage.getItem('usuario')+ "'")
              .textContent('ya ha iniciado sesion desea continuar con el usuario ' + window.localStorage.getItem("usuario")+' ?' )
              .ariaLabel('Lucky day')
              .targetEvent(ev)
              .ok('Ingresar')
              .cancel('Iniciar sesion con otro usuario');
        $mdDialog.show(confirm).then(function() {
          console.log('si');
          $scope.login.usuario = window.localStorage.getItem("usuario");
          $scope.login.clave = window.localStorage.getItem("clave");
          $scope.login.idUsuario = window.localStorage.getItem("idUsuario");
          $location.path('/listaOrdenes');     
        }, function() {
           window.localStorage.setItem("usuario",null)
           window.localStorage.setItem("clave",null)
          window.localStorage.setItem("idUsuario",null)
          $scope.login.usuario = window.localStorage.getItem("usuario");
          $scope.login.clave = window.localStorage.getItem("clave");
          $scope.login.idUsuario = window.localStorage.getItem("idUsuario");
          console.log('no');
        });
    };

    if(window.localStorage.getItem("usuario") != null  && window.localStorage.getItem("clave") != null ){
      console.log("ya se ha logueado");
      console.log("usuario =" + window.localStorage.getItem("usuario"));
      console.log("clave =" + window.localStorage.getItem("clave"));
     $scope.showConfirm();
    }else{
      console.log("no se ha logueado");
      console.log("usuario =" + window.localStorage.getItem("usuario"));
      console.log("clave =" + window.localStorage.getItem("clave"));
            
    }*/
 
    $scope.login =function(){

    console.log('http://'+hostName+':'+puerto+'/'+contexto+'/login?usuario='+$scope.login.usuario+'&pwd='+$scope.login.clave)
    $http.defaults.useXDomain = true;
    $http.get('http://'+hostName+':'+puerto+'/'+contexto+'/login?usuario='+$scope.login.usuario+'&pwd='+$scope.login.clave)
    //alert(t+'/'+contexto+'/login?usuario='+$scope.login.usuario+'&pwd='+$scope.login.clave)
   // $http.get(t+'/'+contexto+'/login?usuario='+$scope.login.usuario+'&pwd='+$scope.login.clave)
              .success(function(data, status, headers, config){
                //alert("**** SUCCESS ****");
               // alert(status);
              })
              .error(function(data, status, headers, config){
                console.log("error ===>");
                console.log(status);
                console.log(data);
                console.log(headers);
                console.log(config);
            
              })
              .then(function(response){
                console.log("respuiesta");
               $scope.jsonRespuesta = response.data;
               console.log("respuiesta");
               console.log(  $scope.jsonRespuesta);
               console.log(  $scope.jsonRespuesta.ok);
              $scope.bodegas  =   $scope.jsonRespuesta.bodegas;

          
               if($scope.jsonRespuesta.ok){
                 
                  console.log($scope.jsonRespuesta);
                  window.localStorage.setItem("usuario" , $scope.login.usuario);
                  window.localStorage.setItem("clave" , $scope.login.clave);
                  window.localStorage.setItem("idUsuario" , $scope.jsonRespuesta.usuario.id);
                  window.localStorage.setItem("objetoUsuario" , JSON.stringify($scope.jsonRespuesta.usuario));
                   console.log("respues de  login  ==>" +$scope.jsonRespuesta.usuario.id);
                   console.log("usuario =" + window.localStorage.getItem("usuario"));
                   console.log("clave =" + window.localStorage.getItem("clave"));
                   console.log("id =" + window.localStorage.getItem("idUsuario"));
                   $scope.login.mostrarMenu = true ;
                  $location.path('/listaOrdenes');     


                 

                } else
               {
                 alert("Usuario  o clave  incorrecto");

               }

             
                
                
         });


//           

    }


}]);
		