'use strict';

angular.module('myApp.moviles', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/moviles', {
    templateUrl: 'ordenesVenta/moviles.html',
    controller: 'movilesCtrl'
  });
}])

.controller('movilesCtrl', [ '$scope', 'datatable', '$location','$http', 'Scopes' ,'$mdDialog', function($scope,datatable ,$location  ,$http , Scopes , $mdDialog ) {
    Scopes.store('movilesCtrl', $scope);
    console.log("variable global " + hostName) ;

    if(window.localStorage.getItem("usuario") === "" ||
    window.localStorage.getItem("clave") === "" ||
    window.localStorage.getItem("idUsuario") === ""){
    console.log("usuario no logueado");
      $location.path('/login');

  }else{
    
  //$scope.login = Scopes.get('loginCtrl').login ; 
  $scope.login = {};
  $scope.login.usuario = window.localStorage.getItem("usuario");
  $scope.login.clave = window.localStorage.getItem("clave");
  $scope.login.mostrarMenu = true ;
  $scope.usuario = JSON.parse(window.localStorage.getItem("objetoUsuario"));

 // $scope.jsonRespuesta = Scopes.get('loginCtrl').jsonRespuesta ; 
  }
   $scope.data = {};   
   $scope.data.cantidadFacturas = 0 ;
   $scope.data.fecha =  new Date(); 


    $scope.envioData =function(){
          
          
          $http.defaults.useXDomain = true;
          $http.post('http://'+hostName+':'+puerto+'/'+contexto+'/cpr/moviles/save?id_movil='+$scope.data.id+'&numero_placa='+$scope.data.placa)
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
                console.log("respuesta");
               $scope.jsonRespuesta = response.data;  
                  if ($scope.jsonRespuesta.mensajes.severidadMaxima != 'INFO') {
                  alert("error" + $scope.jsonRespuesta.mensajes.mensajes[0].texto )

                 }else{
                   console.log($scope.jsonRespuesta);
                     $scope.obtenerDatos();
                  alert("Operacion correcta");
                  
                }                                                         
              
         });
    }

      $scope.obtenerDatos =function(){
          
          
          $http.defaults.useXDomain = true;
          $http.get('http://'+hostName+':'+puerto+'/'+contexto+'/cpr/moviles')
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
                console.log("respuesta");
               $scope.moviles = response.data;     
               if ($scope.moviles.mensajes.severidadMaxima != 'INFO') {
                  alert("error" + $scope.moviles.mensajes.mensajes[0].texto )

                 }else{
                  console.log($scope.moviles);
                  alert("Operacion correcta");
                  
                }                                                    
               
         });


    }
    
    $scope.obtenerDatos();
    

    
   


}]);
		