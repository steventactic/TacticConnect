'use strict';

angular.module('myApp.corteDicermex', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/corteDicermex', {
    templateUrl: 'ordenesVenta/corteDicermex.html',
    controller: 'corteDicermexCtrl'
  });
}])

.controller('corteDicermexCtrl', [ '$scope', 'datatable', '$location','$http', 'Scopes' ,'$mdDialog', function($scope,datatable ,$location  ,$http , Scopes , $mdDialog ) {
    Scopes.store('corteDicermexCtrl', $scope);
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

    
     var emails ; 

    $scope.envioData =function(){

       emails =   $scope.data.listaEmails.split(",");
          
          $scope.json = {fecha : new Date($scope.data.fecha) , emails : emails} ; 
          console.log("json envio") ; 
          console.log (angular.toJson($scope.json, true));
          $http.defaults.useXDomain = true;
          $http.post('http://'+hostName+':'+puerto+'/'+contexto+'/cpr/cortes/corte-ordenes-x-fecha' , $scope.json  )
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
                console.log($scope.jsonRespuesta);  
               $scope.jsonRespuesta = response.data;                                                         
               
                 if ($scope.jsonRespuesta.mensajes.severidadMaxima != 'INFO') {
                  alert("error" + $scope.jsonRespuesta.mensajes.mensajes[0].texto )

                 }else{
                  $scope.data.fecha = new Date();
                  $scope.data.listaEmails = "";
                                     
                  alert("Operacion correcta");
                  
                }       
         });
    }

    
   


}]);
		