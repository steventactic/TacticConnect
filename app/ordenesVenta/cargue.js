'use strict';

angular.module('myApp.cargue', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/cargue', {
    templateUrl: 'ordenesVenta/cargue.html',
    controller: 'cargueCtrl'
  });
}])

.controller('cargueCtrl', [ '$scope', 'datatable', '$location','$http', 'Scopes' ,'$mdDialog', function($scope,datatable ,$location  ,$http , Scopes , $mdDialog ) {
  Scopes.store('cargueCtrl', $scope);
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
   $scope.jsonCargue = [];
   var total ;
   $scope.contarFacturas = function (){
       var facturas = $scope.data.texto ;
       total  =  facturas.split('\n');
       console.log("cantidad = " + total.length );
       $scope.listaOrdenes = "[";
           for (var i = 0 ; i < total.length ; i++) {
              $scope.listaOrdenes += total[i] + ",";  
           }
      $scope.listaOrdenes += $scope.listaOrdenes.substr(0, $scope.listaOrdenes.length -1 );
      $scope.listaOrdenes += "]";
      
       $scope.data.cantidadFacturas =  total.length  ; 
    }
     
    $scope.envioData =function(){
      $scope.jsonCargue=  {                                    
                            "fecha":  new Date($scope.data.fecha), 
                            "numeroOrdenList": total
                          };
                          
      console.log("json de envio  cargue "); 
      console.log(angular.toJson($scope.jsonCargue, true));
      console.log('http://'+hostName+':'+puerto+'/'+contexto+'/cpr/cortes/corte')
      $http.defaults.useXDomain = true;
      $http.post('http://'+hostName+':'+puerto+'/'+contexto+'/cpr/cortes/corte' , $scope.jsonCargue)
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
                 console.log($scope.jsonRespuesta) ;
                 if ($scope.jsonRespuesta.mensajes.severidadMaxima != 'INFO') {
                  alert("error" + $scope.jsonRespuesta.mensajes.mensajes[0].texto );
                 }else{                 
                  $scope.data.texto = "";
                  $scope.data.cantidadFacturas = 0 ;
                  $scope.data.fecha =  new Date();                     
                  alert("Operacion correcta");                  
                }                                                                     
              });
    }
}]);
		