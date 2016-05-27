'use strict';

angular.module('myApp.cargueExcel', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/cargueExcel', {
    templateUrl: 'ordenesVenta/cargueExcel.html',
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

    $scope.dataEsqueleto = [
                            {nombre :'col1',requerido :true},
                            {nombre :'col2',requerido :true},
                            {nombre :'col3',requerido :true},
                            {nombre :'col4',requerido :true},
                            {nombre :'col5',requerido :true},
                            {nombre :'col6',requerido :true},
                            {nombre :'col7',requerido :true},
                            {nombre :'col8',requerido :true},
                            {nombre :'col9',requerido :true},
                            {nombre :'col10',requerido :true}
                          ]; 

    $scope.dataMatch =[];
    $scope.dataNoMatch =[     
                          {nombre :'vacio',requerido:false}
                        ];
    $scope.data = {};   
    $scope.data.cantidadFacturas = 0 ;
    $scope.data.fecha =  new Date(); 
    $scope.jsonCargue = [];
    var total ;
    var columnas  ; 
    $scope.dataDeLinea = [];
    $scope.jsonTemp = "";
    $scope.contarFacturas = function (){
       $scope.dataMatch =[];    
       var facturas = $scope.data.texto ;
       total  =  facturas.split('\n');
       console.log("cantidad = " + total.length );
       $scope.listaOrdenes = "[";
       //recorre todos los saltos de linea
       for (var i = 0 ; i < total.length ; i++) {
        //si es la primera linea  entra para veriricar  match de  columnas
            if(i === 0 ){
              //parte la linea  por  (,)
              columnas = total[i].split('\t');
              //empieza a recorrer el  columnas 
              for (var j = 0; j < columnas.length; j++) {
                //por cada valor de la columna  verifica el esqueleto 
               // for (var k = 0; k < $scope.dataEsqueleto.length  ; k++) {
                   if(columnas[j] ===  $scope.dataEsqueleto[j].nombre){
                      
                      $scope.dataMatch = $scope.dataMatch.concat(
                                            {nombre: $scope.dataEsqueleto[j].nombre, recibido :columnas[j]  , requerido:true}
                                            );
                     //   k = $scope.dataEsqueleto.length + 1 ;
                   } else{
                        $scope.dataMatch = $scope.dataMatch.concat(
                                            {nombre: $scope.dataEsqueleto[j].nombre, recibido :'Asignar' , requerido:true}
                                            );
                        $scope.dataNoMatch = $scope.dataNoMatch.concat(
                                                        {nombre:$scope.dataEsqueleto[j].nombre}
                                                      );
                   }
                }
              // }
             }else{
                columnas = total[i].split('\t');
                $scope.datacomas = total[i].replace(" \t " , ",");
                $scope.dataDeLinea.push(total[i].split('\t'));                            
             }
          $scope.listaOrdenes += total[i] + ",";  
        }     
      $scope.listaOrdenes += $scope.listaOrdenes.substr(0, $scope.listaOrdenes.length -1 );
      $scope.listaOrdenes += "]";      
      $scope.data.cantidadFacturas =  total.length  - 1  ; 
      console.log("data match ==>");
      console.log($scope.dataMatch);
      console.log("data no match ==>");
      console.log($scope.dataNoMatch);
    }

    $scope.jsonData = {};

    $scope.refrescarCombos = function (nombre ,index){
        console.log("eliminar posicion " + nombre );
        for (var i = 0 ; i < $scope.dataNoMatch.length ; i++) {
 
                if($scope.dataNoMatch[i].nombre === nombre){
                  $scope.dataNoMatch.splice(i, 1);   
                  $scope.dataMatch[index].recibido = nombre ;
                  return;
                }            
         }          
    }
     
    $scope.envioData =function(){      
      $scope.asignaciones = [];

      for (var i = 0; i < $scope.dataMatch.length; i++) {
        $scope.asignaciones = $scope.asignaciones.concat(
                                                          {
                                                            id : i,
                                                            nombre : $scope.dataMatch[i].nombre,
                                                            recibido :$scope.dataMatch[i].recibido,
                                                            requerido :$scope.dataMatch[i].requerido
                                                            
                                                          }
                                              );
      }   
       $scope.envio = {
                        asignacion : $scope.asignaciones,
                        data : [$scope.dataDeLinea]
                      }
      console.log(angular.toJson( $scope.envio,true));        
    }   
}]);
		