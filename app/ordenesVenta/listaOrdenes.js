  'use strict';

  angular.module('myApp.listaOrdenes', ['ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/listaOrdenes', {
      templateUrl: 'ordenesVenta/listaOrdenes.html',
      controller: 'listaOrdenesCtrl'
    });
  }])

  .controller('listaOrdenesCtrl', [ '$scope', 'datatable', '$location','$http','Scopes','$mdDialog','$mdMedia','$rootScope','$mdToast',function($scope   ,datatable ,$location ,$http ,Scopes,$mdDialog,$mdMedia ,$rootScope  , $mdToast ) {
  Scopes.store('listaOrdenesCtrl', $scope);
 
  $scope.mensajeServidor =  $rootScope.mensajesServidor; 
   
  $scope.serverData = {};
  //$scope.serverData.ip = "inglaterra";
  //$scope.serverData.puerto = "8080";
  $scope.serverData.ip = hostName;
  $scope.serverData.puerto = puerto;   
  $scope.datos =  {};  
  $scope.datos.seleccionado = 1 ; 
  $scope.refrescar = 0 ; 
  $scope.datos = {};
  $scope.datos.verOpciones = true;
  $scope.jsonListaOrdenes= {};
  $scope.jsonListaOrdenes.idCliente = 0;

  


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

  var last = {
      bottom: true,
      top: false,
      left: true,
      right: false
    };
  $scope.toastPosition = angular.extend({},last);
  $scope.getToastPosition = function() {
    sanitizePosition();
    return Object.keys($scope.toastPosition)
    
      .filter(function(pos) { return $scope.toastPosition[pos]; })
      .join(' ');
  };
  function sanitizePosition() {
    var current = $scope.toastPosition;
    if ( current.bottom && last.top ) current.top = false;
    if ( current.top && last.bottom ) current.bottom = false;
    if ( current.right && last.left ) current.left = false;
    if ( current.left && last.right ) current.right = false;
    last = angular.extend({},current);
  }

 $scope.mostrarInfoUsuario = function() {
    var pinTo = $scope.getToastPosition();
    $mdToast.show({
          template: '<md-toast class="md-toast-steven" ><br>Codigo cliente : 123 , usuario : juanf , Rol : administrador </md-toast>',
          hideDelay   : 6000,
          position    :  'bottom left'
          //controller  : 'ToastCtrl',          
  
     
    });
  };
  
  

  $scope.cerrarSesion =  function (){
         window.localStorage.setItem("usuario" ,"");
         window.localStorage.setItem("clave" , "");
         window.localStorage.setItem("idUsuario" , "");
         window.localStorage.setItem('estadoOrdenCache',"");
         window.localStorage.setItem('tipoServicioCache',"");
         window.localStorage.setItem('clienteCache',"");
         console.log("cerrar sesion  ok  ");
         $location.path('/login');
  }
      $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/satelite/ordenes/estados-ordenes')            
              .error(function(data, status, headers, config){
                console.log("error ===>");
                console.log(status);
                console.log(data);
                console.log(headers);
                console.log(config);            
              })
              .then(function(response){
               
               $scope.estadoOrden = response.data;

              console.log("json cargado estados de la orden ===>" +  $scope.estadoOrden.length);

              console.log( $scope.estadoOrden);
             

         });   



  console.log("id de usuario = " + $scope.usuario.id);
  		$scope.crearOrden = function (){

  			//$state.go('/ordenesVenta');
  			$location.path('/ordenesVenta');

  		}
  	 /****************************** metodos  para  el funcionamiento de  las datatables*******************************Scopes*/

         $scope.Ordenes = [];
           //Simple exemple of data
         $scope.datatableData =[];
     
         $scope.ordenSeleccionada = {}; 
         $scope.cargarEdicion = function(){

            console.log("Entra a cargar edicion");
            console.log($scope.ordenSeleccionada);
            edicionNueva =  "no";
            $location.path('/editarOrden');
            //$scope.seleccion = $scope.gridOptions.selection.getSelectedRows();
            //console.log($scope.selections);

         }
     

          /*************************Objeto que  alamance la  io y el  puerto al cual conectarme****************************/
 
            function rowTemplate() {
                  return '<div ng-dblclick="grid.appScope.rowDblClick(row)" >' +
                               '  <div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>' +
                               '</div>';
                }

          $scope.rowDblClick = function(row) {
       //   alert(JSON.stringify(row.entity)); 
            $scope.cargarEdicion();
          }

        $scope.gridOptions = {enableRowSelection: true, 
                              enableRowHeaderSelection: false,
                              enableColumnResize: true,
                              selectedItems: $scope.selections,
                                enableRowSelection: true,
                                 rowTemplate: rowTemplate()
                              };
        $scope.gridOptions.onRegisterApi = function( gridApi ) {
            $scope.gridApi = gridApi;
              $scope.gridApi.selection.on.rowSelectionChanged($scope, function(row){

                console.log("entra");
                console.log( row.entity.idOrden);
                $scope.ordenSeleccionada =  row.entity ;
                $scope.datos.seleccionado =  0 ; 

                console.log(row);
              });
        };
   
        $scope.toggleRowSelection = function() {
          $scope.gridApi.selection.clearSelectedRows();
          $scope.gridOptions.enableRowSelection = !$scope.gridOptions.enableRowSelection;
          $scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.OPTIONS);
        };

        $scope.gridOptions.multiSelect = false;
       /* console.log('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/ordenes/ordenes-x-tipo_servicio-x-estado-x-usuario?id_tipo_servicio=1&estadoOrden=NO_CONFIRMADA&id_usuario='+$scope.usuario.id);
          $http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/ordenes/ordenes-x-tipo_servicio-x-estado-x-usuario?id_tipo_servicio=1&estadoOrden=NO_CONFIRMADA&id_usuario='+$scope.usuario.id)

          //$http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/ordenes/ordenes-x-tipo_servicio-x-estado-x-usuario?id_tipo_servicio=1&estadoOrden=NO_CONFIRMADA&id_usuario=2')
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
                
                $scope.respuesta= response.data;
                 console.log("json cargado todas las ordenes ===> " );
                 console.log($scope.respuesta) ; 
                 for (var i = 0; i < $scope.respuesta.length; i++) {
                       $scope.datatableData =  $scope.datatableData.concat([{
                                       idOrden :$scope.respuesta[i].datosFacturacion.idOrden,
                                       tipoServicio: $scope.respuesta[i].datosFacturacion.nombreTipoServicio,
                                       cliente: $scope.respuesta[i].datosFacturacion.codigoCliente,
                                       numeroDocumentoOrdenCliente: $scope.respuesta[i].datosFacturacion.numeroDocumentoOrdenCliente,
                                       destinatario: $scope.respuesta[i].datosFacturacion.nombreDestinatario,
                                       nit : $scope.respuesta[i].datosFacturacion.numeroIdentificacionDestinatario,
                                       ciudad : $scope.respuesta[i].destinoOrigen.nombreAlternoCiudad,
                                       usuario : $scope.respuesta[i].destinoOrigen.usuario,
                                       fecha_actualizacion : $scope.respuesta[i].fechaActualizacion
                                   }]);



                 };
                //  console.log("json solo ordenes===> " + $scope.respuesta[0].datosFacturacion );
                 console.log( $scope.datatableData) ; 
               
                  $scope.gridOptions.data = $scope.datatableData ;
                  $scope.gridApi.core.refresh();
                 //Init the datatable with his configuration
                //$scope.datatable = datatable(datatableConfig);
                //Set the data to the datatable
                //$scope.datatable.setData($scope.datatableData);
                                   

          });    */

        $scope.cargaClientes = function(){
        

        console.log("carga cliente lista ordenes ")
          console.log('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/ordenes/clientes-x-usuario?id_usuario='+$scope.usuario.id+'&id_tipo_servicio='+$scope.jsonListaOrdenes.tipoServicio);
         $http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/ordenes/clientes-x-usuario?id_usuario='+$scope.usuario.id+'&id_tipo_servicio='+$scope.jsonListaOrdenes.tipoServicio)          
              .error(function(data, status, headers, config){
                //alert("**** Verificar conexion a internet ****");
                console.log("error ===>");
                console.log(status);
                console.log(data);
                console.log(headers);
                console.log(config);
            
              })
              .then(function(response){
               
               $scope.clientes = response.data;
               console.log("json cargado cliente ===> "  );
               console.log($scope.clientes) ; 
             
          });    

      }
      
      $scope.setidCliente = function( val ){
        $scope.jsonListaOrdenes.idCliente = val;
        console.log("idCliente  en lista ordenes ==> " + $scope.jsonListaOrdenes.idCliente) ; 
      }
      
       $scope.jsonListaOrdenes = {};

       $scope.datos.activarCrearOrden = 0; 
       console.log("valor cache  estado orden  = " +window.localStorage.getItem("estadoOrdenCache"));
       if(window.localStorage.getItem("estadoOrdenCache")  === null){
          console.log("no exite cache ESTADO ORDEN ");
          $scope.jsonListaOrdenes.estadoOrden = "NO_CONFIRMADA";
       }else{
          
          $scope.jsonListaOrdenes.estadoOrden = window.localStorage.getItem("estadoOrdenCache");
          console.log("Ya existe cache de  la variable ESTADO ORDEN " +  $scope.jsonListaOrdenes.estadoOrden);
       }

        if(window.localStorage.getItem("tipoServicioCache") === null ||  
          window.localStorage.getItem("tipoServicioCache") === 'NaN' ||
          window.localStorage.getItem("tipoServicioCache") === ''){
          console.log("no exite cache TIPO SERVICIO ==>");
          console.log(window.localStorage.getItem("tipoServicioCache"));
          //$scope.jsonListaOrdenes.tipoServicio = "";
          $scope.jsonListaOrdenes.idServicio = "";
          
          
           console.log("activar ==>" + $scope.datos.activarCrearOrden);
       }else{          
          //$scope.jsonListaOrdenes.tipoServicio =window.localStorage.getItem("tipoServicioCache");
          $scope.jsonListaOrdenes.idServicio = parseInt(window.localStorage.getItem("tipoServicioCache"));
          console.log("Ya existe cache de  la variable  TIPO SERVICIO " + window.localStorage.getItem("tipoServicioCache"));
          
       }


        if(window.localStorage.getItem("clienteCache")  === null){
          console.log("no exite cache  CLIENTE");
          $scope.jsonListaOrdenes.idCliente = "";
          
       }else{
          $scope.jsonListaOrdenes.idCliente =window.localStorage.getItem("clienteCache");
          console.log("Ya existe cache de  la variable CLIENTE " + $scope.jsonListaOrdenes.idCliente );
       }
         
      $scope.jsonListaOrdenes.tipoServicio = 4 ;
      
      $scope.cargarOrdenes = function (){

          window.localStorage.setItem('estadoOrdenCache',$scope.jsonListaOrdenes.estadoOrden);
          //window.localStorage.setItem('tipoServicioCache',$scope.jsonListaOrdenes.tipoServicio);
          window.localStorage.setItem('tipoServicioCache',$scope.jsonListaOrdenes.idServicio);
          window.localStorage.setItem('clienteCache',$scope.jsonListaOrdenes.idCliente);
          console.log("valor" + window.localStorage.getItem('tipoServicioCache'));
          if(window.localStorage.getItem('tipoServicioCache') != ''){
                $scope.datos.activarCrearOrden = 1; 

          }else{

            console.log("no existe ");
          }
      
         
         $scope.cadena = ""; 
         if($scope.jsonListaOrdenes.idCliente === ''){
            $scope.datos.activarCrearOrden = 0 ; 
          }
         if ($scope.jsonListaOrdenes.idCliente != undefined ){
          $scope.cadena ='http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/ordenes/ordenes-x-tipo_servicio-x-estado-x-usuario?id_tipo_servicio='+$scope.jsonListaOrdenes.idServicio+'&id_estado_orden='+$scope.jsonListaOrdenes.estadoOrden+'&id_usuario='+$scope.usuario.id+'&id_cliente='+$scope.jsonListaOrdenes.idCliente ; 

         }else{

             
          $scope.cadena ='http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/ordenes/ordenes-x-tipo_servicio-x-estado-x-usuario?id_tipo_servicio='+$scope.jsonListaOrdenes.idServicio+'&id_estado_orden='+$scope.jsonListaOrdenes.estadoOrden+'&id_usuario='+$scope.usuario.id ;   
         }
          console.log($scope.cadena);
          $http.get($scope.cadena)
                .error(function(data, status, headers, config){
                      console.log("error ===>");
                      console.log(status);
                      console.log(data);
                      console.log(headers);
                      console.log(config);
              
                })
                .then(function(response){
                
                $scope.respuesta= response.data;
                 console.log("json cargado todas las ordenes ===> " );
                 console.log($scope.respuesta) ; 
                 $scope.datatableData = [] ; 
                 for (var i = 0; i < $scope.respuesta.length; i++) {
                       $scope.datatableData =  $scope.datatableData.concat([{
                                       idOrden :$scope.respuesta[i].idOrden,
                                       tipoServicio: $scope.respuesta[i].datosFacturacion.nombreTipoServicio,
                                       cliente: $scope.respuesta[i].datosFacturacion.codigoCliente,
                                       numeroDocumentoOrdenCliente: $scope.respuesta[i].datosFacturacion.numeroDocumentoOrdenCliente,
                                       destinatario: $scope.respuesta[i].datosFacturacion.nombreDestinatario,
                                       nit : $scope.respuesta[i].datosFacturacion.numeroIdentificacionDestinatario,
                                       ciudad : $scope.respuesta[i].destinoOrigen.nombreAlternoCiudad,
                                       direccion : $scope.respuesta[i].destinoOrigen.direccion,
                                       usuario : $scope.respuesta[i].usuarioActualizacion,
                                       fecha_actualizacion : $scope.respuesta[i].fechaActualizacion

                                   }]);



                 };
                  console.log("json datatable ===> " );
                 console.log( $scope.datatableData) ; 
                $scope.refrescar = 1 ; 
                  $scope.gridOptions.data = [];//$scope.datatableData ;
                   $scope.gridOptions.data = $scope.datatableData ;
                  $scope.gridApi.core.refresh();
                                              

          });    

      }
      
    /*********************************Carga los tipos de sevicio por usaurio  ****************************************************/
    console.log('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/satelite/ordenes/tipos_servicio-x-usuario?id_usuario='+$scope.usuario.id)
         $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/satelite/ordenes/tipos_servicio-x-usuario?id_usuario='+$scope.usuario.id)             
              .error(function(data, status, headers, config){
                    console.log("error ===>");
                console.log(status);
                console.log(data);
                console.log(headers);
                console.log(config);
            
              })
              .then(function(response){
               
               $scope.tipoServicioData = response.data;
              console.log("json cargado tipos de servicio por cliente ===>");
              console.log( $scope.tipoServicioData);
               $scope.cargaClientes();

         });   

      $scope.cargarOrdenes();

  }]);
  		