'use strict';

angular.module('myApp.componenteDireccion', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/componenteDireccion', {
    templateUrl: 'ordenesVenta/componenteDirecciones.html',
    controller: 'direccionCtrl'
  });
}])

.controller('direccionCtrl', [ '$scope', 'datatable', '$location','$http', 'Scopes' ,'$mdDialog', function($scope,datatable ,$location  ,$http , Scopes , $mdDialog ) {
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

  $scope.jsonDireccion = {};
  $scope.jsonDireccion.municipio = 1 ; 
  $scope.jsonDireccion.sentido = 1 ; 
  $scope.jsonDireccion.combo1 = "" ; 
  $scope.jsonDireccion.campo2 = "" ; 
  $scope.jsonDireccion.combo2 = "" ; 
  $scope.jsonDireccion.combo3 = "" ; 
  $scope.jsonDireccion.combo4 = "" ; 
  $scope.jsonDireccion.combo5 = "" ; 
  $scope.jsonDireccion.combo7 = "" ; 
  $scope.jsonDireccion.campo7 = "" ; 
  $scope.jsonDireccion.campo8 = "" ; 
  $scope.jsonDireccion.combo10 = "" ; 
  $scope.jsonDireccion.combo1Val   ="";
  $scope.jsonDireccion.complemento = "";


  $scope.direccionCompleta  =  "";
  $scope.cambiaCombo1 = function (){
    $scope.direccionCompleta  =   $scope.jsonDireccion.combo1Val  + " " + 
                                  $scope.jsonDireccion.campo2 + 
                                  $scope.jsonDireccion.combo2 + " " +
                                  $scope.jsonDireccion.combo3 + " " +
                                  $scope.jsonDireccion.combo4 + " " +
                                  $scope.jsonDireccion.combo5 + " " +
                                  $scope.jsonDireccion.campo7 +
                                  $scope.jsonDireccion.combo7 + " " + 
                                  $scope.jsonDireccion.campo8 + " " + 
                                  $scope.jsonDireccion.combo10 ;                
     console.log( $scope.direccionCompleta ) ; 
  }
 
 $scope.jsonDireccion.textoComplemento = ""; 
  $scope.agregarComplemento = function (){
  $scope.direccionCompleta  +=  " " + $scope.jsonDireccion.complemento  + " " +   
                                      $scope.jsonDireccion.textoComplemento  + " ";
  $scope.jsonDireccion.textoComplemento = ""; 
  $scope.jsonDireccion.complemento = ""; 
}

$scope.borrar = function (){
   $scope.direccionCompleta = "" ;
   $scope.jsonDireccion.combo1Val  ="" ; 
   $scope.jsonDireccion.campo2  = ""  ; 
   $scope.jsonDireccion.combo2  = "" ;
   $scope.jsonDireccion.combo3 ="" ; 
   $scope.jsonDireccion.combo4 = "";
   $scope.jsonDireccion.combo5 = "";
   $scope.jsonDireccion.campo7 = "";
   $scope.jsonDireccion.combo7  = ""; 
   $scope.jsonDireccion.campo8  = ""; 
   $scope.jsonDireccion.combo10 = "";

}

  $scope.sentidos = [
                      {nombre: "Escoja una opción" , id: 1},
                      {nombre: "SUR - NORTE" , id: 2},
                      {nombre: "NORTE - SUR" , id: 3},
                      {nombre: "ESTE - OESTE" , id: 4},
                      {nombre: "OESTE - ESTE" , id: 5}
                    ];

  $scope.combo1 = [
                      {nombre: "Escoja una opción" , id: ""},
                      {nombre: "Avenida calle" , id:  "Avenida calle"},
                      {nombre: "Avenida carrera" , id: "Avenida carrera"},
                      {nombre: "Calle" , id: "Calle"},
                      {nombre: "Carrera" , id: "Carrera" },
                      {nombre: "Diagonal" , id: "Diagonal" },
                      {nombre: "Transversal" , id: "Transversal"}
                    ];

  $scope.combo2 = [    
                       {nombre: "" , id: ""},                
                       {nombre: "A" , id: "A"},
                       {nombre: "B" , id: "B"},
                       {nombre: "C" , id: "C"},
                       {nombre: "D" , id: "D"},
                       {nombre: "E" , id: "E"},
                       {nombre: "F" , id: "F"},
                       {nombre: "G" , id: "G"},
                       {nombre: "H" , id: "H"},
                       {nombre: "I" , id: "I"},
                       {nombre: "J" , id: "J"},
                       {nombre: "K" , id: "K"},
                       {nombre: "L" , id: "L"},
                       {nombre: "M" , id: "M"},
                       {nombre: "N" , id: "N"},
                       {nombre: "O" , id: "O"},
                       {nombre: "P" , id: "P"},
                       {nombre: "Q" , id: "Q"},
                       {nombre: "R" , id: "R"},
                       {nombre: "S" , id: "S"},
                       {nombre: "T" , id: "T"},
                       {nombre: "U" , id: "U"},
                       {nombre: "V" , id: "V"},
                       {nombre: "W" , id: "W"},
                       {nombre: "X" , id: "X"},
                       {nombre: "Y" , id: "Y"},
                       {nombre: "Z" , id: "Z"}                                           
                  ];

  $scope.combo3 = [
                    {nombre: "" , id: ""},
                    {nombre: "BIS" , id: "BIS"},
                  ];

  $scope.combo4= [
                    {nombre: "" , id: ""},
                    {nombre: "SUR" , id: "SUR"},
                    {nombre: "NORTE" , id: "NORTE"},
                    {nombre: "ESTE" , id:"ESTE" },
                    {nombre: "OESTE" , id: "OESTE"}
                  ];

 $scope.complementos = [
                        
                          {nombre: "Escoja una opción" , id: ""},
                          {nombre: "Apartamento" , id: "Apartamento"},
                          {nombre: "Agrupación" , id: "Agrupación"},
                          {nombre: "Bloque" , id: "Bloque"},
                          {nombre: "Bodega" , id: "Bodega"},
                          {nombre: "Camino" , id: "Camino"},
                          {nombre: "Carretera" , id: "Carretera"},
                          {nombre: "Celula" , id: "Celula"},
                          {nombre: "Casa" , id: "Casa"},
                          {nombre: "Conjunto" , id: "Conjunto"},
                          {nombre: "Consultorio" , id: "Consultorio"},
                          {nombre: "Deposito" , id: "Deposito"},
                          {nombre: "Edificio",id: "Edificio"},
                          {nombre: "Entrada" , id: "Entrada"},
                          {nombre: "Esquina" , id: "Esquina"},
                          {nombre: "Etapa" , id: "Etapa"},
                          {nombre: "Garaje" , id: "Garaje"},
                          {nombre: "Interior" , id: "Interior"},
                          {nombre: "Kilometro" , id: "Kilometro"},
                          {nombre: "Local" , id: "Local"},
                          {nombre: "Lote" , id: "Lote" },
                          {nombre: "Manzana" , id: "Manzana"},
                          {nombre: "Mesanine" , id: "Mesanine"},
                          {nombre: "Módulo" , id: "Módulo"},
                          {nombre: "Oficina" , id: "Oficina" },
                          {nombre: "Paseo" , id: "Paseo"},
                          {nombre: "Parcela" , id: "Parcela"},
                          {nombre: "Penthouse" , id: "Penthouse" },
                          {nombre: "Piso" , id: "Piso" },
                          {nombre: "Puente" , id: "Puente"},
                          {nombre: "Predio" , id: "Predio" },
                          {nombre: "Salon comunal" , id: "Salon comunal"},
                          {nombre: "Sector" , id: "Sector"},
                          {nombre: "Solar" , id: "Solar" },
                          {nombre: "Semi sótano" , id: "Semi sótano" },
                          {nombre: "Super manzana" , id: "Super manzana" },
                          {nombre: "Torre" , id: "Torre"},
                          {nombre: "Unidad" , id: "Unidad"},
                          {nombre: "Unidad residencial" , id: "Unidad residencial"},
                          {nombre: "Urbanizacion" , id: "Urbanizacion"},
                          {nombre: "Zona" , id: "Zona"},
                       ];


 
  
}]);
		
