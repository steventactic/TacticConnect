'use strict';

angular.module('myApp.ordenesVenta', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/ordenesVenta', {
    templateUrl: 'ordenesVenta/ordenesVenta.html',
    controller: 'ordenesVentaCtrl'
  });
}])

.controller('ordenesVentaCtrl', [ '$scope', '$http','datatable','$mdDialog','$mdMedia','$mdToast','$location','Scopes','$rootScope',function($scope  , $http ,datatable ,  $mdDialog, $mdMedia , $mdToast ,$location ,Scopes ,$rootScope) {
	    Scopes.store('ordenesVentaCtrl', $scope);


       if(window.localStorage.getItem("usuario")    === "" ||
          window.localStorage.getItem("clave")      === "" ||
          window.localStorage.getItem("idUsuario")  === ""){
          console.log("usuario no logueado");
            $location.path('/login');

        }else{
          
        //$scope.login = Scopes.get('loginCtrl').login ; 
        $scope.login = {};
        $scope.login.usuario = window.localStorage.getItem("usuario");
        $scope.login.clave = window.localStorage.getItem("clave");
        $scope.login.mostrarMenu = true ;
        $scope.usuario = JSON.parse(window.localStorage.getItem("objetoUsuario"));
        $scope.login.id  = $scope.usuario.id;
       // $scope.jsonRespuesta = Scopes.get('loginCtrl').jsonRespuesta ; 
        }
      //$scope.login = Scopes.get('loginCtrl').login ; 
      //$scope.jsonRespuesta = Scopes.get('loginCtrl').jsonRespuesta ; 
      //$scope.login.id  = $scope.jsonRespuesta.usuario.id;
      $scope.jsonListaOrdenes = Scopes.get('listaOrdenesCtrl').jsonListaOrdenes;
      $scope.tipoServicioData  = Scopes.get('listaOrdenesCtrl').tipoServicioData;
      console.log("idUsuario =>" + $scope.login.id);
      console.log("tipo servicio ==> " + $scope.tipoServicioData);
      console.log("servicio " + $scope.jsonListaOrdenes.idServicio);
      console.log($scope.jsonListaOrdenes);

      for (var i = 0; i <  $scope.tipoServicioData.length; i++) {
         if(parseInt($scope.tipoServicioData[i].id) ===  parseInt($scope.jsonListaOrdenes.idServicio)){
               $scope.titulo=$scope.tipoServicioData[i].nombre;
               $scope.tipoServicioEnvio =  $scope.tipoServicioData[i].id ; 

         }
      }

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

     $scope.volver = function (ev){

           var confirm = $mdDialog.confirm()
                .title('Informacion')
                .textContent('Si retrocede se perderan todos los cambios.')
                .ariaLabel('Mensaje')
                .targetEvent(ev)
                .ok('ok')
                .cancel('Cancelar');
          $mdDialog.show(confirm).then(function() {
            
             $location.path('/listaOrdenes');
          }, function() {
            
            console.log("no hace nada");
          });

    }
        
    /*************************Loguica  para  bloqueo  y desbloqueo de  las tabs ****************************************/

    $scope.dataTabs = {};
    $scope.dataTabs.tabFacturacion = false;
    $scope.dataTabs.tabEnvio = false;
    $scope.dataTabs.tabEntrega = false;
    $scope.dataTabs.tabProductos = false;
    $scope.dataTabs.tabSoportesDocumentales = false;
    $scope.dataTabs.tabSeleccionada = 0; 
    $scope.jsonFacturacion = {};
    $scope.jsonFacturacionEnvio = [];
    $scope.jsonEnvio = {};
    $scope.jsonEnvioEnvio = [];
    $scope.jsonEntrega =[];
    $scope.jsonEntregaEnvio=[];
    $scope.jsonEntregaProducto=[];    
    $scope.productosTemporales = [];
    $scope.mostrarEditar =  0;
    $scope.mostrarEliminar =  0;
    $scope.agregaDestinoNuevo = true;
    $scope.jsonFacturacion.numeroDocumento = Number(new Date());   
    
   //  $scope.mensajesServidor = Scopes.get('loginCtrl').mensajesServidor;
  /*$scope.productosTemporales=  $scope.productosTemporales.concat([
                                  {
                                    "producto":1, 
                                    "bodega":54456744 ,
                                     "cantidad" : 10  ,
                                     "unidad"  : "Bu" , 
                                     "lote":"123423",
                                     "notas" :"texto"
                                  }
                              ]);
*/
    $scope.campoRequerido = "";
    $scope.showAlert = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    // Modal dialogs should fully cover application
    // to prevent interaction outside of dialog
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title('Atencion')
        .textContent('El campo '+$scope.campoRequerido+' es requerido.')
        .ariaLabel('mensaje')
        .ok('Aceptar')
        .targetEvent(ev)
    );
  };
    $scope.verificaDocumento  = function(){
      console.log("valor cliente ==> ");   


      console.log( $scope.jsonFacturacion.cliente);        
          /*if($scope.jsonFacturacion.cliente === undefined ||
                  $scope.jsonFacturacion.cliente === 'undefined'){
            $scope.campoRequerido = "'Cliente'";
            $scope.showAlert();
            return;           

           }else if($scope.jsonFacturacion.segmento === undefined ||
                $scope.jsonFacturacion.segmento === 'undefined'){

            $scope.campoRequerido = "'Segmento'";
            $scope.showAlert();
            return;
         }

         else */
          if($scope.jsonFacturacion.destinatario === undefined ||
                  $scope.jsonFacturacion.destinatario === 'undefined'){

            $scope.campoRequerido = "'Destinatario'";
            $scope.showAlert();
            return;

         }

         else if($scope.jsonFacturacion.numeroDocumento === null || 
            $scope.jsonFacturacion.numeroDocumento === "" ||
            $scope.jsonFacturacion.numeroDocumento === undefined ||
            $scope.jsonFacturacion.numeroDocumento === 'undefined' ){
            $scope.campoRequerido = "'Numero documento'";
            $scope.showAlert();
            return;
         }else {
            $scope.validaTabFacturacion();
               

          }

    }
   
    $scope.jsonFacturacionEnvio = [];
    $scope.validaTabFacturacion =  function()
    {        
      if( $scope.jsonFacturacion.nombre === null  || $scope.jsonFacturacion.nombre === 'null'  ){
            $scope.jsonFacturacion.nombre = "";
      }
      if( $scope.jsonFacturacion.telefonos === null  || $scope.jsonFacturacion.telefonos === 'null'  ){
            $scope.jsonFacturacion.telefonos = "";
      }
      if( $scope.jsonFacturacion.email === null  || $scope.jsonFacturacion.email === 'null'  ){
            $scope.jsonFacturacion.email = "";
      }
      $scope.jsonFacturacion.cliente  = window.localStorage.getItem('clienteCache');
      $scope.jsonFacturacionEnvio =  [
                                  {
                                    idOrden :null, 
                                    tipoServicio : parseInt($scope.tipoServicioEnvio),  
                                    cliente : parseInt($scope.jsonFacturacion.cliente),
                                    //cliente :14,                               
                                    numeroDocumentoOrdenCliente :$scope.jsonFacturacion.numeroDocumento,
                                    //segmento :parseInt($scope.jsonFacturacion.segmento),
                                    segmento :7,
                                    destinatario:parseInt($scope.jsonFacturacion.destinatario),
                                    nombre :$scope.jsonFacturacion.nombre,
                                    telefonos :$scope.jsonFacturacion.telefonos,
                                    email :$scope.jsonFacturacion.email,
                                    idUsuario : $scope.serverData.idUsuario,
                                    usuario: $scope.serverData.usuario ,
                                    estadoOrdenType : "NO_CONFIRMADA"

                                  }
                              ];
      console.log("json de facturacion");
      console.log(angular.toJson($scope.jsonFacturacionEnvio, true));
     
        console.log('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/'+contexto+'/ordenes/saveDatosFacturacion' , $scope.jsonFacturacionEnvio)
       $http.post('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/'+contexto+'/ordenes/saveDatosFacturacion' , $scope.jsonFacturacionEnvio)
       //$http.post('http://192.170.112.193:8080/satelite/ordenes/saveDatosFacturacion' , $scope.jsonFacturacionEnvio)
              
              .error(function(data, status, headers, config){
                //alert("**** Verificar conexion a internet ****");
                    console.log("error ===>");
                console.log(status);
                console.log(data);
                console.log(headers);
                console.log(config);
            
              })
              .then(function(response){
              
              $scope.jsonFacturacionRetorno= response.data;
               console.log("json cargado retorno  insert factura  ===> " );
               console.log($scope.jsonFacturacionRetorno);
               console.log("severidad maxima  ==>" + $scope.jsonFacturacionRetorno.mensajes.severidadMaxima);

             //  console.log("json   ===> " +$scope.jsonFacturacionRetorno.orden.datosFacturacion.estadoOrdenType);
              // console.log($scope.jsonFacturacionRetorno) ; 
               
              if ($scope.jsonFacturacionRetorno.mensajes.severidadMaxima != 'INFO') {
                  alert("error" + $scope.jsonFacturacionRetorno.mensajes.mensajes[0].texto )

              }else{
                   $scope.dataTabs.tabEnvio = false;
                   edicionNueva =  "si";

                   //$scope.dataTabs.tabSeleccionada =1; 
                    $location.path('/editarOrden');

              }

        });    

      /* $scope.showSimpleToast = function() {
              var pinTo = $scope.getToastPosition();
              $mdToast.show(
                $mdToast.simple()
                  .textContent('Orden creada  con el id  ')
                  .position(pinTo )
                  .hideDelay(3000)
                );
            */
  /************ejemplo quemado de retorno ***********/
 // $scope.jsonFacturacion.nombre = $scope.jsonFacturacionRetorno.nombre;
//console.log($scope.jsonFacturacionRetorno.orden.datosFacturacion.nombre);
    
      //$scope.dataTabs.tabFacturacion = true;
    }

    $scope.validaTabEnvio =  function()
    {        
       $scope.jsonEnvioEnvio =  [
                                  {
                                    idOrden :$scope.jsonFacturacionRetorno.orden.idOrden,
                                    destino : parseInt($scope.jsonEnvio.destino),
                                    bodega :1,
                                    ciudad : $scope.jsonEnvio.ciudad,
                                    nombreAlternoCiudad : ""   ,                                
                                    usuario: 2,
                                    direccion : $scope.jsonEnvio.direccion,
                                    indicacionesDireccion : $scope.jsonEnvio.indicacionesDireccion,
                                    direccionEstandarizada : "",
                                    longitud :parseInt("1213132"),
                                    latitud :parseInt("1213132"),
                                    nombre :$scope.jsonEnvio.nombre,
                                    telefonos :$scope.jsonEnvio.telefonos,
                                    email :$scope.jsonEnvio.email,
                                    idUsuario:parseInt($scope.login.id),
                                    usuario:$scope.login.usuario     
                                                                   
                                  }
                              ];
       console.log("json de envio");
       console.log(angular.toJson($scope.jsonEnvioEnvio, true));
     //  console.log($scope.jsonEnvio)
       $http.post('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/'+contexto+'/ordenes/saveDestinoOrigen' , $scope.jsonEnvioEnvio)
              
              .error(function(data, status, headers, config){
               // alert("**** Verificar conexion a internet ****");
                console.log("error ===>");
                console.log(status);
                console.log(data);
                console.log(headers);
                console.log(config);
            
              })
              .then(function(response){
              
              $scope.jsonEnvioRetorno= response.data;
               console.log("json cargado retorno  insert envio  ===> " );
               console.log($scope.jsonEnvioRetorno) ; 
              if ($scope.jsonEnvioRetorno.mensajes.severidadMaxima != 'INFO') {
                  alert("error" + $scope.jsonEnvioRetorno.mensajes.mensajes[0].texto )

              }else{
                  $scope.dataTabs.tabSeleccionada =2; 
                $scope.dataTabs.tabEntrega = false;
              }


        });   
     

      //$scope.dataTabs.tabEnvio = true;      
      
    }
    $scope.validaTabEntrega = function()
    {         
      console.log($scope.data.info);
        if(parseInt($scope.data.info) === 0 ){

            $scope.jsonEntrega.desde = $scope.jsonEntrega.soloFecha ;
            $scope.jsonEntrega.hasta = $scope.jsonEntrega.soloFecha ;

        }
        $scope.jsonEntregaEnvio =  [
                                {
                                  idOrden :$scope.jsonEnvioRetorno.orden.idOrden   ,                              
                                  estado : $scope.jsonFacturacion.estadoOrdenType,
                                 // soloFecha: $scope.jsonEntrega.soloFecha,
                                  fechaMinima: $scope.jsonEntrega.desde,
                                  fechaMaxima: $scope.jsonEntrega.hasta,
                                  jornada: $scope.jsonEntrega.jornada,
                                  horaMinima: $scope.jsonEntrega.horaMinima,
                                  horaMaxima: $scope.jsonEntrega.horaMaxima,
                                  idUsuario:parseInt($scope.login.id),
                                  usuario:$scope.login.usuario    
                                }
                              ];
        console.log("Json entrega") ;
        console.log(angular.toJson($scope.jsonEntregaEnvio, true));
        
        $http.post('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/'+contexto+'/ordenes/saveDatosEntregaRecogida' , $scope.jsonEntregaEnvio)
              
              .error(function(data, status, headers, config){
               // alert("**** Verificar conexion a internet ****");
                console.log("error ===>");
                console.log(status);
                console.log(data);
                console.log(headers);
                console.log(config);
            
              })
              .then(function(response){
              
              $scope.jsonEntregaRetorno= response.data;
               console.log("json cargado retorno  insert entrega  ===> " );
               console.log($scope.jsonEntregaRetorno) ; 

                 if ($scope.jsonEntregaRetorno.mensajes.severidadMaxima != 'INFO') {
                  alert("error" + $scope.jsonEntregaRetorno.mensajes.mensajes[0].texto )

              }else{
                  $scope.dataTabs.tabProductos = false;      
              $scope.dataTabs.tabSeleccionada =3; 
              }    

        });   

      //$scope.dataTabs.tabEntrega = true;      
    }
       $scope.validaTabProductos = function()
    {        
      $scope.dataTabs.tabSoportesDocumentales = false;      
      $scope.dataTabs.tabSeleccionada =4; 
        console.log(angular.toJson($scope.productosTemporales, true));
      //$scope.dataTabs.tabProductos = true;      
    }
    
    /*************************Objeto que  alamance la  io y el  puerto al cual conectarme****************************/
    $scope.serverData = {};
    $scope.serverData.ip = hostName;
    $scope.serverData.puerto = puerto;
  //  $scope.serverData.ip = "192.170.112.187";
  //  $scope.serverData.puerto = "8080";
    $scope.serverData.usuario =  window.localStorage.getItem("usuario");
    $scope.serverData.idUsuario =  window.localStorage.getItem("idUsuario");
    $scope.tipoServicioData = [];
     
    /*********************************Carga los tipos de sevicio por usaurio  ****************************************************/
        
        $scope.cargaTiposServicio= function(val){

              $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/'+contexto+'/ordenes/tipos_servicio-x-usuario?id_usuario='+$scope.login.id)                   
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
                      for (var i = 0 ; i < $scope.tipoServicioData.length ; i++) {
               
                        if(parseInt(val) === parseInt($scope.tipoServicioData[i].id)){
                            console.log("entro a if" + $scope.tipoServicioData[i].nombre ) ; 
                            $scope.nombreTipoServicio = $scope.tipoServicioData[i].nombre ;  
                            console.log("registar destino en la orden  = " + $scope.tipoServicioData[i].registrarDesitinoEnLaOrden  );
                            if($scope.tipoServicioData[i].registrarDesitinoEnLaOrden){
                                  if($scope.tipoServicioData[i].admiteBodegasComoDestino)
                                  {
                                    $scope.admiteBodegasDestino  = 0 ; 
                                    console.log("Bodega como destino true");
                                  }else{
                                    $scope.admiteBodegasDestino  = 1 ; 
                                    console.log("Bodega como destino false");
                                  }
                            }else{
                                   if($scope.tipoServicioData[i].admiteBodegasComoOrigen)
                                  {
                                    $scope.admiteBodegasDestino  = 0 ; 
                                    console.log("Bodega como origen true");
                                  }else{
                                    $scope.admiteBodegasDestino  = 1 ; 
                                      console.log("Bodega como origen true");
                                  }
                            }                          
                        }
                     }
               });  
      }   

    //******************************Clientes por  usuario  **********************************************************/

      /*  $scope.clientes= [
                       {"id":"1", "codigo":"ENTEC" , "nombre":"ENTEC" , "numeroIdentificacion" : "1215646"},
                       {"id":"2", "codigo":"AMBEV" , "nombre":"AMBEV" , "numeroIdentificacion" : "546456"},
                       {"id":"3", "codigo":"CPA" , "nombre":"CPA" , "numeroIdentificacion" : "232342"},
                    ];
      */
      $scope.admiteBodegasDestino  = 0 ; 
      $scope.cargaClientes = function(val){
        
        $scope.jsonFacturacion.tipoServicio  = val;
     
         $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/'+contexto+'/ordenes/clientes-x-usuario?id_usuario='+$scope.login.id+'&id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio)
             
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
               $scope.cargaTiposServicio(val);

          });    


      }
      $scope.cargaClientes($scope.jsonListaOrdenes.tipoServicio);

     
     /********************************Combo segmentos  ***************************************************************/

      /*$scope.segmento= [
         {"id":"1", "texto":"Cliente final"}         
      ];*/
      $scope.habi = {};
      $scope.habi.habilitarAgregarDestinatario = true;
      $scope.cargaSegmentos = function (val ,nombre){
         $scope.jsonFacturacion.cliente = val ; 
         $scope.jsonFacturacion.nombreCliente = nombre ; 
         $scope.jsonFacturacion.segmento = val ; 
         $scope.agregaDestinoNuevo = false ;
    //    $scope.dest.selectedItem = undefined ;
       // $scope.dest.searchText.nombre = "";
        
         $scope.habi.habilitarAgregarDestinatario = false;
         $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/'+contexto+'/ordenes/segmentos-x-cliente-x-tipo_servicio?id_cliente='+$scope.jsonListaOrdenes.idCliente+'&id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio )
             
              .error(function(data, status, headers, config){
               // alert("**** Verificar conexion a internet ****");
                console.log("error ===>");
                console.log(status);
                console.log(data);
                console.log(headers);
                console.log(config);
              })
              .then(function(response){
                $scope.cargarConfiguracion($scope.jsonListaOrdenes.idCliente , $scope.jsonFacturacion.tipoServicio );
                $rootScope.segmento= response.data;
                //$scope.segmento= response.data;
               console.log("json cargado segmento ===> " );
               console.log($scope.segmento) ; 

        });    

      }
     $scope.cargaSegmentos();
      /*************************Combo deestinartario por  tipo de servicio y clientes*******************************/
       /* $scope.destinatario= [
                   {"id":"1", "texto":"Destinatario1"},
                   {"id":"2", "texto":"aecrDestinatario1"},
                   {"id":"3", "texto":"bbbhDestinatario1"}                                            
        ];*/
  
        $scope.cargaDestinatarios = function (val ,nombre){
           $scope.jsonFacturacion.segmento = val ; 

           //$scope.jsonFacturacion.nombreSegmento = nombre ; 
            
            $scope.destinatario=[];
            
          console.log('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/'+contexto+'/ordenes/destinatarios_remitentes-x-cliente?id_cliente=14&id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio +'&id_segmento='+ $scope.jsonFacturacion.segmento) 
          $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/'+contexto+'/ordenes/destinatarios_remitentes-x-cliente?id_cliente=14&id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio +'&id_segmento='+ $scope.jsonFacturacion.segmento)
          // $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/satelite/ordenes/destinatarios_remitentes-x-cliente?id_cliente='+$scope.jsonFacturacion.cliente+'&id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio +'&id_segmento='+$scope.jsonFacturacion.segmento)
             
              .error(function(data, status, headers, config){
              //  alert("**** Verificar conexion a internet ****");
                console.log("error ===>");
                console.log(status);
                console.log(data);
                console.log(headers);
                console.log(config);
              })
              .then(function(response){
               
                $scope.destinatario= response.data;
               console.log("json cargado deestinartario ===> " );
              console.log($scope.destinatario) ; 
            

           });    

        }
        //$scope.cargaDestinatarios();
        /*************************Combo ciudad*******************************************/
         
        /* $scope.ciudad= [
                   {"id":"1", "codigo":"bogota" ,"nombreAlterno" :"Bogota" ,"ordinal":"ordinal"},
                   {"id":"2", "codigo":"cali" ,"nombreAlterno" :"Cali" ,"ordinal":"ordinal2"},
                   {"id":"3", "codigo":"medellin" ,"nombreAlterno" :"Medellin" ,"ordinal":"ordinal3"},
        ];*/
        $scope.cargaCiudadEnvio = function(val){
         // $scope.jsonFacturacion.destinatario = val ; 
          $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/'+contexto+'/ordenes/ciudades-x-destinatario_remitente?id_destinatario_remitente='+$scope.jsonFacturacion.destinatario+'&id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio )
            
              .error(function(data, status, headers, config){
                //alert("**** Verificar conexion a internet ****");
                    console.log("error ===>");
                console.log(status);
                console.log(data);
                console.log(headers);
                console.log(config);
            
              })
              .then(function(response){
               
                $scope.ciudad= response.data;
               console.log("json cargado ciudad ===> "+$scope.destinatario[0].id   + "----" +  $scope.jsonFacturacion.destinatario );
               console.log($scope.ciudad) ; 
               console.log("Destinatarios ==>");
               console.log($scope.destinatario);
               for (var i = 0; i < $scope.destinatario.length; i++) {
               
           
                   if(parseInt($scope.destinatario[i].id) === parseInt($scope.jsonFacturacion.destinatario)){
                    //if(angular.equals($scope.destinatario[i].id, $scope.jsonFacturacion.destinatario)){
                   // console.log("entra" +  $scope.destinatario.numeroIdentificacion );
                      //$scope.jsonFacturacion.numeroDocumento =  $scope.destinatario[i].numeroIdentificacion;
                      $scope.jsonFacturacion.nombre  = $scope.destinatario[i].contacto.nombres ;
                      $scope.jsonFacturacion.telefonos  = $scope.destinatario[i].contacto.telefonos;
                      $scope.jsonFacturacion.email  = $scope.destinatario[i].contacto.email;

                   }
                
               };

          });  
          $scope.cargaCiudadEnvioShiptToBodega();  
        }
           /*************************Combo ciudad shipto bodega *******************************************/
         
        /* $scope.ciudad= [
                   {"id":"1", "codigo":"bogota" ,"nombreAlterno" :"Bogota" ,"ordinal":"ordinal"},
                   {"id":"2", "codigo":"cali" ,"nombreAlterno" :"Cali" ,"ordinal":"ordinal2"},
                   {"id":"3", "codigo":"medellin" ,"nombreAlterno" :"Medellin" ,"ordinal":"ordinal3"},
        ];*/
        $scope.cargaCiudadEnvioShiptToBodega = function(){
       
          $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/'+contexto+'/ordenes/ciudades-con-bodega-x-cliente?id_cliente='+$scope.jsonFacturacion.cliente+'&id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio )
             
              .error(function(data, status, headers, config){
                //alert("**** Verificar conexion a internet ****");
                    console.log("error ===>");
                console.log(status);
                console.log(data);
                console.log(headers);
                console.log(config);
            
              })
              .then(function(response){
               
                $scope.ciudadShipTOBodega= response.data;
               console.log("json cargado ciudad ship to bodega ===> ");
               console.log($scope.ciudadShipTOBodega) ;          

          });    

        }

         $scope.cargaBodegasShiptToBodegas = function (val){
              $scope.jsonEnvio.valorBodegaShipTo  = val ;
              console.log('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/ordenes/bodegas-x-ciudad-x-cliente?id_cliente='+$scope.jsonFacturacion.cliente+'&id_ciudad='+$scope.jsonEnvio.valorBodegaShipTo+'&id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio)
             $http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/ordenes/bodegas-x-ciudad-x-cliente?id_cliente='+$scope.jsonFacturacion.cliente+'&id_ciudad='+$scope.jsonEnvio.valorBodegaShipTo+'&id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio)
                   
                    .error(function(data, status, headers, config){
                     // alert("**** Verificar conexion a internet ****");
                         console.log("error ===>");
                console.log(status);
                console.log(data);
                console.log(headers);
                console.log(config);
                  
                    })
                    .then(function(response){
                     
                     $scope.bodegasShipToBodega= response.data;
                

                     console.log($scope.bodegasShipToBodega) ; 

                });    
                
            }
         
         /*******************************Combo destino  *********************************************/
        // DestinosOrigenes Por Destinatario Por Ciudad idDestinatarioRemitente,idCiudad,idTipoServicio
        /*$scope.destino= [
                   {"id":"1", "texto":"Destino cargado 1 "},
                   {"id":"2", "texto":"Destino cargado 2 "},
                   {"id":"3", "texto":"Destino cargado 3 "}
        ];*/
        $scope.destino = [];
        
        $scope.cargaDestinosEnvio = function (val){
          $scope.jsonEnvio.ciudad = val;
            $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/'+contexto+'/ordenes/destinos_origenes-x-destinatario_remitente-x-ciudad?id_destinatario_remitente='+$scope.jsonFacturacion.destinatario+'&id_ciudad='+$scope.jsonEnvio.ciudad+'&id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio)
              
              .error(function(data, status, headers, config){
               // alert("**** Verificar conexion a internet ****");
                   console.log("error ===>");
                console.log(status);
                console.log(data);
                console.log(headers);
                console.log(config);
            
              })
              .then(function(response){
               
               $scope.destino= response.data;
               console.log("json cargado destino ===> " );
               console.log($scope.destino) ; 

          });    

        }

        /******************************Cargar informacion destino envio***************/

        $scope.cargaInfoDestinoEnvio = function (val){
          $scope.jsonEnvio.destino = val;
          console.log("evento carga info destino" + $scope.jsonEnvio.destino); 


          for (var i = 0 ; i < $scope.destino.length; i++) {
             console.log($scope.destino[i]);
                 if(parseInt($scope.jsonEnvio.destino) === parseInt($scope.destino[i].id)){
                  console.log("ENtra");
                     $scope.jsonEnvio.direccion = $scope.destino[i].direccion.direccion;
                     $scope.jsonEnvio.nombre = $scope.destino[i].contacto.nombres;
                     $scope.jsonEnvio.indicacionesDireccion = $scope.destino[i].direccion.indicacionesDireccion;
                     $scope.jsonEnvio.telefonos =  $scope.destino[i].contacto.telefonos ;
                     $scope.jsonEnvio.email = $scope.destino[i].contacto.email ;


                 }
           }

        }


      /*******************************Combo productos  por  cliente  *********************************************/
       $scope.productosCliente = [];

        $scope.cargarProductosCliente = function (cliente,tipoServicio){
              
            $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/'+contexto+'/ordenes/productos-x-cliente?id_cliente='+cliente+'&id_tipo_servicio='+tipoServicio)
             
              .error(function(data, status, headers, config){
                //alert("**** Verificar conexion a internet ****");
                console.log("error ===>");
                console.log(status);
                console.log(data);
                console.log(headers);
                console.log(config);
              })
              .then(function(response){
               
               $scope.productosCliente= response.data;
              console.log("json cargado productos ===> " );
              console.log('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/'+contexto+'/ordenes/productos-x-cliente?id_cliente='+cliente+'&id_tipo_servicio='+tipoServicio);

               console.log($scope.productosCliente) ; 

          });    

        }

      /*******************************Combo jornada  *********************************************/

    /*  $scope.jornadaEntrega= [
                   {"id":"1", "texto":"Am"},
                   {"id":"2", "texto":"Pm"},
                   {"id":"3", "texto":"Am/Pm"}                
        ];*/
       $scope.configuracionData = [];


        $scope.cargarConfiguracion = function (cliente,tipoServicio){
            console.log('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/'+contexto+'/ordenes/configuracion_orden-x-tipo_servicio?id_tipo_servicio='+tipoServicio+'&id_cliente='+cliente)  
            $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/'+contexto+'/ordenes/configuracion_orden-x-tipo_servicio?id_tipo_servicio='+tipoServicio+'&id_cliente='+cliente)
             
              .error(function(data, status, headers, config){
              //  alert("**** Verificar conexion a internet ****");
                    console.log("error ===>");
                console.log(status);
                console.log(data);
                console.log(headers);
                console.log(config);
              })
              .then(function(response){
               
               $scope.configuracionData= response.data;
              console.log("json cargado configuracion ===> " );
            //  console.log('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/satelite/ordenes/configuracion_orden-x-tipo_servicio?id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio+'&id_cliente='+$scope.jsonFacturacion.cliente);

               console.log($scope.configuracionData) ; 
               console.log("-----------------------------------")
              $scope.jornadaEntrega = $scope.configuracionData[0].jornadas;
              $scope.requerimientosDocumentales =  $scope.configuracionData[1].requerimientosDocumentales ; 
               console.log($scope.configuracionData[0].jornadas);
               console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
               console.log($scope.configuracionData[1].requerimientosDocumentales);

          });    

        }
  
         /*********************Cargar  hora apartir de  la  seleccion de  jornada******************************/ 
         $scope.cargaHoras = function (){
             for (var i =  0; i < $scope.jornadaEntrega.length; i++) {
                if($scope.jsonEntrega.jornada ===$scope.jornadaEntrega[i].codigo )
                {
                    console.log("Entra");
                    $scope.jsonEntrega.horaMinima = $scope.jornadaEntrega[i].horaMinima;
                    $scope.jsonEntrega.horaMaxima = $scope.jornadaEntrega[i].horaMaxima
                }
             };

         }

        $scope.estadoEntrega= [
                   {"id":"1", "texto":"En elaboracion"}
                 
        ];

         $scope.opcionEntrega= [
                   {"id":"1", "texto":"Corte mas proximo"}
                 
        ];
  
    /***********************Datos  para  la  tabla de productos  ******************************************/
        var test = 10  ;
        var producto  = "";
        var idLineaOrden = "";
        var bodega = "";
        var cantidad = "" ; 
        var unidad = "";
        var lote ="";
        var notas ="";
        $scope.productosTemporales= [];


        $scope.columnDefs= [
                              {field:'numeroItem', displayName: 'Línea',visible: true , width : '5%'},
                              {field:'codigoProducto', displayName: 'Producto' ,visible: true , width : '12%'},                              
                              {field:'nombreProducto', displayName: 'Nombre producto',visible: true , width : '12%'},                              
                              {field:'codigoUnidad', displayName: 'Unidad',visible: true , width : '10%'},
                              {field:'codigoUnidadAlterno', displayName: 'Unidad alterno',visible: true, width : '16%'},                        
                              {field:'cantidad', displayName: 'Cantidad' ,visible: true , width : '8%'},                              
                              {field:'codigoBodega', displayName: 'Bodega' ,visible:true , width : '12%'}, 
                              {field:'nombreBodega', displayName: 'Nombre bodega' ,visible: true , width : '12%'},  
                              {field:'lote', displayName: 'Lote' ,visible: true , width : '12%'} ,                                                         
                              {field:'notas', displayName: 'Notas',visible: true , width : '40%'},                              
                              {field:'usuario', displayName: 'usuario',visible: true , width : '12%'},
                              {field:'fechaActualizacion', displayName: 'Fecha actualización',visible: true , width : '18%'},
                              {field:'codigoProductoAlterno', displayName: 'Producto alterno' ,visible: true, width : '16%'},
                              {field:'bodega', displayName: 'Bodega' , visible: false},                                                                                     
                              {field:'disponibilidad', displayName: 'Disponibilidad',visible: false},                            
                              {field:'idLineaOrden', displayName: 'Id linea orden' ,visible: false},
                              {field:'idOrden', displayName: 'Id  orden' ,visible: false},
                              {field:'idUsuario', displayName: 'Id  usuario' ,visible: false},                                                                                         
                              {field:'nombreUnidad', displayName: 'Nombre unidad',visible: false},                                                            
                              {field:'producto', displayName: 'producto',visible: false},
                              {field:'unidad', displayName: 'unidad',visible: false}
                              
                            ];

      $scope.gridOptions = {enableRowSelection: true, 
                            enableRowHeaderSelection: false,
                            selectedItems: $scope.selections,
                            enableRowSelection: true,
                            enableColumnResize : true,
                            columnDefs :$scope.columnDefs

                            };
           $scope.gridOptions.multiSelect = false;
              $scope.gridOptions.onRegisterApi = function( gridApi ) {
                  $scope.gridApi = gridApi;
                    $scope.gridApi.selection.on.rowSelectionChanged($scope, function(row){
                        console.log("entra");
                        console.log( row.entity.idOrden);
                        $scope.ordenSeleccionada =  row.entity ;
                        console.log(row);
                        console.log(row.entity.idLineaOrden);
                        idLineaOrden =  row.entity.idLineaOrden ; 
                        producto = row.entity.nombreProducto;
                        bodega = row.entity.nombreBodega;
                        cantidad = row.entity.cantidad;
                        unidad = row.entity.nombreUnidad;
                        lote = row.entity.lote;
                        notas  = row.entity.notas ;
                       //   

                         $scope.mostrarEditar =  1;
                         $scope.mostrarEliminar =  1;
                      });
                };

          /***********************Datos  para  la  tabla de paqueteo  ******************************************/          
           $scope.columnDefsPaqueteo= [
                              {field:'numeroItem', displayName: 'Línea',visible: true , width : '5%'},
                              {field:'codigoProducto', displayName: 'Producto' ,visible: true , width : '12%'},                              
                              {field:'nombreProducto', displayName: 'Nombre producto',visible: true , width : '12%'},                              
                              {field:'codigoUnidad', displayName: 'Unidad',visible: true , width : '10%'},
                              {field:'codigoUnidadAlterno', displayName: 'Unidad alterno',visible: true, width : '16%'},                        
                              {field:'cantidad', displayName: 'Cantidad' ,visible: true , width : '8%'},                              
                              {field:'codigoBodega', displayName: 'Bodega' ,visible:true , width : '12%'}, 
                              {field:'nombreBodega', displayName: 'Nombre bodega' ,visible: true , width : '12%'},  
                              {field:'lote', displayName: 'Lote' ,visible: true , width : '12%'} ,                                                         
                              {field:'notas', displayName: 'Notas',visible: true , width : '40%'},                              
                              {field:'usuario', displayName: 'usuario',visible: true , width : '12%'},
                              {field:'fechaActualizacion', displayName: 'Fecha actualización',visible: true , width : '18%'},
                              {field:'codigoProductoAlterno', displayName: 'Producto alterno' ,visible: true, width : '16%'},
                              {field:'bodega', displayName: 'Bodega' , visible: false},                                                                                     
                              {field:'disponibilidad', displayName: 'Disponibilidad',visible: false},                            
                              {field:'idLineaOrden', displayName: 'Id linea orden' ,visible: false},
                              {field:'idOrden', displayName: 'Id  orden' ,visible: false},
                              {field:'idUsuario', displayName: 'Id  usuario' ,visible: false},                                                                                         
                              {field:'nombreUnidad', displayName: 'Nombre unidad',visible: false},                                                            
                              {field:'producto', displayName: 'producto',visible: false},
                              {field:'unidad', displayName: 'unidad',visible: false}
                              
                            ];

      $scope.gridOptionsPaqueteo = {enableRowSelection: true, 
                            enableRowHeaderSelection: false,
                            selectedItems: $scope.selections,
                            enableRowSelection: true,
                            enableColumnResize : true,
                            columnDefs :$scope.columnDefsPaqueteo

                            };
           $scope.gridOptionsPaqueteo.multiSelect = false;
              $scope.gridOptionsPaqueteo.onRegisterApi = function( gridApi ) {
                  $scope.gridApi = gridApi;
                    $scope.gridApi.selection.on.rowSelectionChanged($scope, function(row){
                        console.log("entra");
                        console.log( row.entity.idOrden);
                        $scope.ordenSeleccionada =  row.entity ;
                        console.log(row);
                        console.log(row.entity.idLineaOrden);
                        idLineaOrden =  row.entity.idLineaOrden ; 
                        producto = row.entity.nombreProducto;
                        bodega = row.entity.nombreBodega;
                        cantidad = row.entity.cantidad;
                        unidad = row.entity.nombreUnidad;
                        lote = row.entity.lote;
                        notas  = row.entity.notas ;
                       //   

                         $scope.mostrarEditar =  1;
                         $scope.mostrarEliminar =  1;
                      });
                };


        $scope.imprimir = function (){
        $scope.productosTemporales=  $scope.productosTemporales.concat([
                                  {
                                    "nombreProducto":producto, 
                                    "nombreBodega":bodega,
                                    "cantidad" : cantidad  ,
                                    "nombreUnidad"  : unidad , 
                                    "lote":lote ,
                                    "notas" :notas
                                  }
                              ]);

      //console.log(angular.toJson($scope.productosTemporales, true));
      $scope.gridOptions.data = $scope.productosTemporales ;

      }

      /*********************eliminar linea ******************************/
      $scope.eliminarLinea= function ()
      {

        console.log("Entra a eliminar" + idLineaOrden);
        console.log('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/'+contexto+'/ordenes/'+$scope.jsonFacturacionRetorno.orden.idOrden+'/deleteLineaOrden/'+idLineaOrden+'/'+$scope.login.usuario);
        $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/'+contexto+'/ordenes/'+$scope.jsonFacturacionRetorno.orden.idOrden+'/deleteLineaOrden/'+idLineaOrden+'/'+$scope.login.usuario)
              
              .error(function(data, status, headers, config){
            //    alert("**** Verificar conexion a internet ****");
                console.log("error ===>");
                console.log(status);
                console.log(data);
                console.log(headers);
                console.log(config);
            
              })
              .then(function(response){
               
               $scope.respuestaEliminacion= response.data;
               console.log("json respuesta eliminar  linea ===> " );                 
               console.log($scope.respuestaEliminacion) ; 
               if ($scope.respuestaEliminacion.mensajes.severidadMaxima != 'INFO') {
                  alert("error" + $scope.respuestaEliminacion.mensajes.mensajes[0].texto )

                 }else{

                  $scope.gridOptions.data = [] ;
                  $scope.gridOptions.data = $scope.respuestaEliminacion.orden.lineas ;
            }

          });    


      }

  /************editar evento ********************/
      $scope.esEdicion =  0 ; 
      $scope.editarLinea = function(){
            $scope.esEdicion =  1 ; 
            $scope.showAdvanced();
            //    $scope.jsonProductoAdd.producto = "";
                //$scope.jsonProductoAdd.bodega ="" ;
                
              //  $scope.jsonProductoAdd.unidad = "";
             

      }
/**************Agregar producto**********************/
   
      $scope.agregarLinea = function(){
            $scope.esEdicion =  0 ; 
            $scope.showAdvanced();
            //    $scope.jsonProductoAdd.producto = "";
                //$scope.jsonProductoAdd.bodega ="" ;
                
              //  $scope.jsonProductoAdd.unidad = "";
             

      }



      /*************************Ventana  modal de agregar  producto ********************************************/
      
  
      $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');        
       $scope.showAdvanced = function(ev) {
        
          var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
          $mdDialog.show({
            controller: DialogController,
            templateUrl: './ordenesVenta/agregarProducto.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: useFullScreen,
             locals: { serverData: $scope.serverData ,
                       jsonFacturacion :$scope.jsonFacturacion , 
                       productosTemporales :$scope.productosTemporales , 
                       imprimir  : $scope.imprimir ,   
                       tabla :$scope.datatable ,
                      jsonEntregaRetorno :  $scope.jsonEntregaRetorno,
                       login :$scope.login,
                       gridOptions : $scope.gridOptions,
                       esEdicion:$scope.esEdicion}
          })
          .then(function(answer) {
            $scope.status = 'You said the information was "' + answer + '".';

          }, function() {
            $scope.status = 'You cancelled the dialog.';
          });
          $scope.$watch(function() {
            return $mdMedia('xs') || $mdMedia('sm');
          }, function(wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
          });
        };


         $scope.cerrarAdvanced = function(){
          console.log("entra");
          $mdDialog.hide()
          $scope.esEdicion = 0 ;
         }

     
        function DialogController($scope, $mdDialog ,serverData,jsonFacturacion,productosTemporales,imprimir,tabla ,jsonEntregaRetorno , login ,gridOptions  ,esEdicion ) 
        {

              $scope.login = login ; 
              $scope.serverData =serverData;
              $scope.jsonFacturacion = jsonFacturacion;
              $scope.datatable = []
              $scope.productosTemporales  = productosTemporales;
              $scope.imprimir   =  imprimir;
              $scope.datatable = tabla;
              $scope.jsonProductoAdd = [];
              $scope.jsonProductoAdd.disponible = 275;
              $scope.jsonEntregaRetorno = jsonEntregaRetorno;
              $scope.jsonEntregaProducto = [];
              $scope.gridOptions = gridOptions ; 
              $scope.idLineaOrden  = null;
              $scope.primeraVez = 0; 
              $scope.valor= undefined ; 
              $scope.esEdicion = esEdicion ; 

              if($scope.esEdicion === 0 )
              { 
                    console.log("Agregar un producto  nuevo");
                    $scope.jsonProductoAdd.producto = "";
                    $scope.jsonProductoAdd.bodega ="" ;
                    $scope.jsonProductoAdd.cantidad = "";
                    $scope.jsonProductoAdd.unidad = "";
                    $scope.jsonProductoAdd.lote ="";
                    $scope.jsonProductoAdd.notas  ="";
              


              }else{
                    $scope.idLineaOrden  =  idLineaOrden  ; 
                    $scope.jsonProductoAdd.producto = producto;
                    $scope.jsonProductoAdd.bodega =bodega ;
                    $scope.jsonProductoAdd.cantidad = cantidad;
                    $scope.jsonProductoAdd.unidad = unidad;
                    $scope.jsonProductoAdd.lote =lote;
                    $scope.jsonProductoAdd.notas  =notas;

                    console.log("Editar un producto existente ==>"  + $scope.idLineaOrden);


              }



                $http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/ordenes/productos-x-cliente?id_cliente='+ $scope.jsonFacturacion.cliente+'&id_tipo_servicio='+ $scope.jsonFacturacion.tipoServicio)
                  
                  .error(function(data, status, headers, config){
                   // alert("**** Verificar conexion a internet ****");
                        console.log("error ===>");
                console.log(status);
                console.log(data);
                console.log(headers);
                console.log(config);
                  })
                  .then(function(response){
                   
                   $scope.productosCliente= response.data;
                  console.log("json cargado productos ===> " );
                  console.log('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/ordenes/productos-x-cliente?id_cliente='+ $scope.jsonFacturacion.cliente+'&id_tipo_servicio='+ $scope.jsonFacturacion.tipoServicio);

                   console.log($scope.productosCliente) ; 

              });    


            /**************************Carga bodegas a partir de un producto*************************************************/
            $scope.cargaBodegas = function (val){
              $scope.jsonProductoAdd.producto = val;
             $http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/ordenes/bodegas-x-producto?id_producto='+$scope.jsonProductoAdd.producto)
                    
                    .error(function(data, status, headers, config){
                     // alert("**** Verificar conexion a internet ****");
                         console.log("error ===>");
                console.log(status);
                console.log(data);
                console.log(headers);
                console.log(config);
                  
                    })
                    .then(function(response){
                     
                     $scope.bodegasProducto= response.data;
                   //  $scope.jsonProductoAdd.nombre = item.attributes["data-nombre"].value;

                    //console.log("json cargado bodegas ===> " + item.attributes["data-nombre"].value );
                    //console.log(item.currentTarget.getAttribute("data-nombre"));
                    console.log('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/ordenes/bodegas-x-producto?id_producto='+$scope.jsonProductoAdd.producto);

                     console.log($scope.bodegasProducto) ; 

                });    
                 $scope.cargaUnidades();   
            }
            $scope.cargaValorBodega = function(val){
              console.log("entra a asignar valor de bodega");
              $scope.jsonProductoAdd.bodega = val ;
            
             /**************************Carga unidades por producto*************************************************/
            }
            $scope.cargaUnidades = function (){
             $http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/ordenes/unidades-x-producto?id_producto='+$scope.jsonProductoAdd.producto)
                    
                    .error(function(data, status, headers, config){
                     // alert("**** Verificar conexion a internet ****");
                         console.log("error ===>");
                console.log(status);
                console.log(data);
                console.log(headers);
                console.log(config);
                  
                    })
                    .then(function(response){
                     
                     $scope.unidadesProducto= response.data;
                    console.log("json cargado unidades producto ===> " );
                    console.log('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/ordenes/unidades-x-producto?id_producto='+$scope.jsonProductoAdd.producto);
                     console.log($scope.unidadesProducto) ; 



                });    
            }

            $scope.cerrarModal = function (){

                $mdDialog.hide();
            }

           
            $scope.agregarProductoTemporal = function (){
            
               console.log("data entrega en modal ");
               console.log($scope.jsonEntregaRetorno);
               
                $scope.jsonEntregaProducto=  [{

                                                   idLineaOrden: $scope.idLineaOrden,
                                                   idOrden :parseInt($scope.jsonEntregaRetorno.orden.idOrden ),
                                                   numeroItem : 10,
                                                   producto :parseInt($scope.jsonProductoAdd.producto) ,
                                                   cantidad :parseInt($scope.jsonProductoAdd.cantidad),
                                                   unidad : parseInt($scope.jsonProductoAdd.unidad),
                                                   bodega :parseInt($scope.jsonProductoAdd.bodega),
                                                   lote :$scope.jsonProductoAdd.lote,
                                                   notas :$scope.jsonProductoAdd.notas,
                                                   idUsuario:parseInt($scope.login.id),
                                                    usuario:$scope.login.usuario  

                                              }];
              console.log("jsonEntregaProducto  data  =>");
              console.log(angular.toJson($scope.jsonEntregaProducto, true));

              console.log('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/ordenes/saveLineaOrden' , $scope.jsonEntregaProducto)
              $http.post('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/ordenes/saveLineaOrden' , $scope.jsonEntregaProducto)
                    
                    
                   

                    .error(function(data, status, headers, config){
                     // alert("**** Verificar conexion a internet ****");
                      console.log("error ===>");
                      console.log(status);
                      console.log(data);
                      console.log(headers);
                      console.log(config);
                   
                    })
                    .then(function(response){
                    
                            $scope.jsonProductoRetorno= response.data;
                            console.log("Data");
                            console.log($scope.jsonProductoRetorno) ;               
                          
                            //$scope.primeraVez = 1 ; 
                          //  idLineaOrden = $scope.jsonProductoRetorno.orden.lineas[0].idLineaOrden;
                           // console.log("id linea orden cargado  =>" +$scope.valor ); 

                              if ($scope.jsonProductoRetorno.mensajes.severidadMaxima != 'INFO') {
                                alert("error" + $scope.jsonProductoRetorno.mensajes.mensajes[0].texto )

                               }else{
                                     //$scope.imprimir();
                                        console.log("json cargado retorno  productos ===> ");
                                     console.log($scope.jsonProductoRetorno.orden.lineas);
                                       $scope.gridOptions.data = [];
                                         $scope.gridOptions.data = $scope.jsonProductoRetorno.orden.lineas;
                                        /* $scope.gridOptions.columnDefs[0].visible = false;
                                          $scope.gridOptions.columnDefs[1].visible = false;
                                          $scope.gridOptions.columnDefs[2].visible = false;
                                          $scope.gridOptions.columnDefs[3].visible = false;
                                          $scope.gridOptions.columnDefs[4].visible = false;*/

                                        $mdDialog.hide();
                                        $scope.jsonProductoAdd.producto = "";
                                        $scope.jsonProductoAdd.bodega ="" ;
                                        $scope.jsonProductoAdd.cantidad = "";
                                        $scope.jsonProductoAdd.unidad = "";
                                        $scope.jsonProductoAdd.lote ="";
                                        $scope.jsonProductoAdd.notas  ="";
                            }                              
                   });   
             
                  
            }
      }


      /*************************************Ventana modal paqueteo****************************************/


      $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');        
       $scope.showAdvancedPaqueteo = function(ev) {
        
          var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
          $mdDialog.show({
            controller: DialogCotrollerPaqueteo,
            templateUrl: './ordenesVenta/agregarPaqueteo.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: useFullScreen,
             locals: { serverData: $scope.serverData ,
                       jsonFacturacion :$scope.jsonFacturacion , 
                       productosTemporales :$scope.productosTemporales , 
                       imprimir  : $scope.imprimir ,   
                       tabla :$scope.datatable ,
                      jsonEntregaRetorno :  $scope.jsonEntregaRetorno,
                       login :$scope.login,
                       gridOptions : $scope.gridOptions,
                       esEdicion:$scope.esEdicion}
          })
          .then(function(answer) {
            $scope.status = 'You said the information was "' + answer + '".';

          }, function() {
            $scope.status = 'You cancelled the dialog.';
          });
          $scope.$watch(function() {
            return $mdMedia('xs') || $mdMedia('sm');
          }, function(wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
          });
        };


         $scope.cerrarAdvanced = function(){
          console.log("entra");
          $mdDialog.hide()
          $scope.esEdicion = 0 ;
         }

     
        function DialogCotrollerPaqueteo($scope, $mdDialog ,serverData,jsonFacturacion,productosTemporales,imprimir,tabla ,jsonEntregaRetorno , login ,gridOptions  ,esEdicion ) 
        {

              $scope.login = login ; 
              $scope.serverData =serverData;
              $scope.jsonFacturacion = jsonFacturacion;
              $scope.datatable = []
              $scope.productosTemporales  = productosTemporales;
              $scope.imprimir   =  imprimir;
              $scope.datatable = tabla;
              $scope.jsonProductoAdd = [];
              $scope.jsonProductoAdd.disponible = 275;
              $scope.jsonEntregaRetorno = jsonEntregaRetorno;
              $scope.jsonEntregaProducto = [];
              $scope.gridOptions = gridOptions ; 
              $scope.idLineaOrden  = null;
              $scope.primeraVez = 0; 
              $scope.valor= undefined ; 
              $scope.esEdicion = esEdicion ; 
               $scope.items = ["mercancia tipo 1","mercancia tipo 2","mercancia tipo 3","mercancia tipo 4"];
      $scope.selected = [];

            /*  if($scope.esEdicion === 0 )
              { 
                    console.log("Agregar un producto  nuevo");
                    $scope.jsonProductoAdd.producto = "";
                    $scope.jsonProductoAdd.bodega ="" ;
                    $scope.jsonProductoAdd.cantidad = "";
                    $scope.jsonProductoAdd.unidad = "";
                    $scope.jsonProductoAdd.lote ="";
                    $scope.jsonProductoAdd.notas  ="";
              


              }else{
                    $scope.idLineaOrden  =  idLineaOrden  ; 
                    $scope.jsonProductoAdd.producto = producto;
                    $scope.jsonProductoAdd.bodega =bodega ;
                    $scope.jsonProductoAdd.cantidad = cantidad;
                    $scope.jsonProductoAdd.unidad = unidad;
                    $scope.jsonProductoAdd.lote =lote;
                    $scope.jsonProductoAdd.notas  =notas;

                    console.log("Editar un producto existente ==>"  + $scope.idLineaOrden);


              }*/

              /*  $http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/ordenes/productos-x-cliente?id_cliente='+ $scope.jsonFacturacion.cliente+'&id_tipo_servicio='+ $scope.jsonFacturacion.tipoServicio)
                  .success(function(data, status, headers, config){
                    //alert("**** SUCCESS ****");
                   // alert(status);

                  })
                  .error(function(data, status, headers, config){
                   // alert("**** Verificar conexion a internet ****");
                        console.log("error ===>");
                console.log(status);
                console.log(data);
                console.log(headers);
                console.log(config);
                  })
                  .then(function(response){
                   
                   $scope.productosCliente= response.data;
                  console.log("json cargado productos ===> " );
                  console.log('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/ordenes/productos-x-cliente?id_cliente='+ $scope.jsonFacturacion.cliente+'&id_tipo_servicio='+ $scope.jsonFacturacion.tipoServicio);

                   console.log($scope.productosCliente) ; 

              });   */ 


            /**************************Carga bodegas a partir de un producto*************************************************/
            /*$scope.cargaBodegas = function (val){
              $scope.jsonProductoAdd.producto = val;
             $http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/ordenes/bodegas-x-producto?id_producto='+$scope.jsonProductoAdd.producto)
                    .success(function(data, status, headers, config){
                      //alert("**** SUCCESS ****");
                     // alert(status);

                    })
                    .error(function(data, status, headers, config){
                     // alert("**** Verificar conexion a internet ****");
                         console.log("error ===>");
                console.log(status);
                console.log(data);
                console.log(headers);
                console.log(config);
                  
                    })
                    .then(function(response){
                     
                     $scope.bodegasProducto= response.data;
                   //  $scope.jsonProductoAdd.nombre = item.attributes["data-nombre"].value;

                    //console.log("json cargado bodegas ===> " + item.attributes["data-nombre"].value );
                    //console.log(item.currentTarget.getAttribute("data-nombre"));
                    console.log('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'satelite/ordenes/bodegas-x-producto?id_producto='+$scope.jsonProductoAdd.producto);

                     console.log($scope.bodegasProducto) ; 

                });    
                 $scope.cargaUnidades();   
            }
            $scope.cargaValorBodega = function(val){
              console.log("entra a asignar valor de bodega");
              $scope.jsonProductoAdd.bodega = val ;
            
             
            }*/
            /**************************Carga unidades por producto*************************************************/
           /* $scope.cargaUnidades = function (){
             $http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/satelite/ordenes/unidades-x-producto?id_producto='+$scope.jsonProductoAdd.producto)
                    .success(function(data, status, headers, config){
                      //alert("**** SUCCESS ****");
                     // alert(status);

                    })
                    .error(function(data, status, headers, config){
                     // alert("**** Verificar conexion a internet ****");
                         console.log("error ===>");
                console.log(status);
                console.log(data);
                console.log(headers);
                console.log(config);
                  
                    })
                    .then(function(response){
                     
                     $scope.unidadesProducto= response.data;
                    console.log("json cargado unidades producto ===> " );
                    console.log('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'satelite/ordenes/unidades-x-producto?id_producto='+$scope.jsonProductoAdd.producto);
                     console.log($scope.unidadesProducto) ; 



                });    
            }
*/

            $scope.cerrarModal = function (){

                $mdDialog.hide();
            }

           
            $scope.agregarProductoTemporal = function (){
                   console.log("data entrega en modal ");
                   console.log($scope.jsonEntregaRetorno);
                   
                    $scope.jsonEntregaProducto=  [{

                                                   idLineaOrden: $scope.idLineaOrden,
                                                   idOrden :parseInt($scope.jsonEntregaRetorno.orden.idOrden ),
                                                   numeroItem : 10,
                                                   producto :parseInt($scope.jsonProductoAdd.producto) ,
                                                   cantidad :parseInt($scope.jsonProductoAdd.cantidad),
                                                   unidad : parseInt($scope.jsonProductoAdd.unidad),
                                                   bodega :parseInt($scope.jsonProductoAdd.bodega),
                                                   lote :$scope.jsonProductoAdd.lote,
                                                   notas :$scope.jsonProductoAdd.notas,
                                                   idUsuario:parseInt($scope.login.id),
                                                    usuario:$scope.login.usuario  

                                              }];

                      console.log("jsonEntregaProducto  data  =>");
                      console.log(angular.toJson($scope.jsonEntregaProducto, true));

                      console.log('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/ordenes/saveLineaOrden' , $scope.jsonEntregaProducto)
                      $http.post('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/ordenes/saveLineaOrden' , $scope.jsonEntregaProducto)
                    
                    
                         
                          .error(function(data, status, headers, config){
                           // alert("**** Verificar conexion a internet ****");
                            console.log("error ===>");
                            console.log(status);
                            console.log(data);
                            console.log(headers);
                            console.log(config);
                         
                          })

                            .then(function(response){
                    
                            $scope.jsonProductoRetorno= response.data;
                            console.log("Data");
                            console.log($scope.jsonProductoRetorno) ;               
                          
                            //$scope.primeraVez = 1 ; 
                          //  idLineaOrden = $scope.jsonProductoRetorno.orden.lineas[0].idLineaOrden;
                           // console.log("id linea orden cargado  =>" +$scope.valor ); 

                              if ($scope.jsonProductoRetorno.mensajes.severidadMaxima != 'INFO') {
                                alert("error" + $scope.jsonProductoRetorno.mensajes.mensajes[0].texto )

                               }else{
                                     //$scope.imprimir();
                                        console.log("json cargado retorno  productos ===> ");
                                     console.log($scope.jsonProductoRetorno.orden.lineas);
                                       $scope.gridOptions.data = [];
                                         $scope.gridOptions.data = $scope.jsonProductoRetorno.orden.lineas;
                                        /* $scope.gridOptions.columnDefs[0].visible = false;
                                          $scope.gridOptions.columnDefs[1].visible = false;
                                          $scope.gridOptions.columnDefs[2].visible = false;
                                          $scope.gridOptions.columnDefs[3].visible = false;
                                          $scope.gridOptions.columnDefs[4].visible = false;*/

                                        $mdDialog.hide();
                                        $scope.jsonProductoAdd.producto = "";
                                        $scope.jsonProductoAdd.bodega ="" ;
                                        $scope.jsonProductoAdd.cantidad = "";
                                        $scope.jsonProductoAdd.unidad = "";
                                        $scope.jsonProductoAdd.lote ="";
                                        $scope.jsonProductoAdd.notas  ="";
                            }                              
                   });  
            }            
           
      }

      /********************Ventana  modal  para agregar destinos  **************************/
       $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');        
       $scope.showAdvancedDestinosBillTo = function(ev) {
        
          var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
          $mdDialog.show({
            controller: DialogCotrollerDestinosBillTo,
            templateUrl: './ordenesVenta/agregarDestinoBillTo.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: useFullScreen,
             locals: { serverData: $scope.serverData ,
                       jsonFacturacion :$scope.jsonFacturacion , 
                       productosTemporales :$scope.productosTemporales , 
                       imprimir  : $scope.imprimir ,   
                       tabla :$scope.datatable ,
                      jsonEntregaRetorno :  $scope.jsonEntregaRetorno,
                       login :$scope.login,
                       gridOptions : $scope.gridOptions,
                       esEdicion:$scope.esEdicion 
                       
                       }
          })
          .then(function(answer) {
            $scope.status = 'You said the information was "' + answer + '".';

          }, function() {
            $scope.status = 'You cancelled the dialog.';
          });
          $scope.$watch(function() {
            return $mdMedia('xs') || $mdMedia('sm');
          }, function(wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
          });
        };
         function DialogCotrollerDestinosBillTo($scope, $mdDialog ,serverData,jsonFacturacion,productosTemporales,imprimir,tabla ,jsonEntregaRetorno , login ,gridOptions  ,esEdicion , $rootScope ) 
        {

              $scope.login = login ; 
              $scope.serverData =serverData;
              $scope.jsonFacturacion = jsonFacturacion;
              $scope.datatable = []
              $scope.productosTemporales  = productosTemporales;
              $scope.imprimir   =  imprimir;
              $scope.datatable = tabla;
              $scope.jsonProductoAdd = [];
              $scope.jsonProductoAdd.disponible = 275;
              $scope.jsonEntregaRetorno = jsonEntregaRetorno;
              $scope.jsonEntregaProducto = [];
              $scope.gridOptions = gridOptions ; 
              $scope.idLineaOrden  = null;
              $scope.primeraVez = 0; 
              $scope.valor= undefined ; 
              $scope.esEdicion = esEdicion ; 
              $scope.items = ["mercancia tipo 1","mercancia tipo 2","mercancia tipo 3","mercancia tipo 4"];
            
              $scope.cerrarModal = function (){
                $mdDialog.hide();
                console.log("entra  limpiar");
              // $rootScope.segmento = [];
              // $rootScope.segmento = ["paso"];
              }

                $http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/destinatarios_remitentes/tipos_identificacion')
                        
                        .error(function(data, status, headers, config){
                             console.log("error ===>");
                              console.log(status);
                              console.log(data);
                              console.log(headers);
                              console.log(config);                  
                        })
                        .then(function(response){
                         
                         $scope.tiposDocumento= response.data;
                         console.log("respuesta tipos documento =>");
                         console.log($scope.tiposDocumento);
                        
                         
                   });  

                  $http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/destinatarios_remitentes/segmentos')
                        
                        .error(function(data, status, headers, config){
                             console.log("error ===>");
                              console.log(status);
                              console.log(data);
                              console.log(headers);
                              console.log(config);                  
                        })
                        .then(function(response){
                         
                         $scope.segmentosDest= response.data;
                         console.log("respuesta tipos segmentos  =>");
                         console.log($scope.segmentosDest);
                        
                         
                   });  
              $scope.selected = [];
        
                $scope.toggle = function (item, list) {
                
                  var idx = list.indexOf(item);
                  if (idx > -1) {
                    list.splice(idx, 1);
                  }
                  else {
                    list.push(item);
                  }
                };
                $scope.exists = function (item, list) {

                  return list.indexOf(item) > -1;
                };




                 $scope.faltanDatos = false;

                $scope.validarCreacion = function (){
                  if($scope.selected.length <= 0  ){
                         
                         $scope.campoValidacionDestinoBill = "Segmentos";
                         $scope.faltanDatos = true;
                      //   $scope.mostrarMensajeDatosFaltantes();
                         return;
                         
                  
                  }
                  else if(window.localStorage.getItem('clienteCache')  === undefined){
                  
                         $scope.campoValidacionDestinoBill = "Cliente";
                          $scope.faltanDatos = true;

                    //     $scope.mostrarMensajeDatosFaltantes();
                         return;
                         
                  }else if($scope.jsonDestinosBillTo.identificacionType === undefined){
                         
                         $scope.campoValidacionDestinoBill = "Tipo identificacion";
                         $scope.faltanDatos = true;
                      //   $scope.mostrarMensajeDatosFaltantes();
                         return;
                         
                  }else if($scope.jsonDestinosBillTo.numeroIdentificacion === undefined){
                         
                         $scope.campoValidacionDestinoBill = "Numero identificación";
                         $scope.faltanDatos = true;
                      //   $scope.mostrarMensajeDatosFaltantes();
                         return;
                         
                  }else if($scope.jsonDestinosBillTo.nombre === undefined){
                         
                         $scope.campoValidacionDestinoBill = "Nombre";
                         $scope.faltanDatos = true;
                      //   $scope.mostrarMensajeDatosFaltantes();
                         return;
                         
                  
                  }else{

                    $scope.crearDestinatario();
                    //console.log("llamar crear ");
                  }
             
              }  

              $scope.jsonDestinosBillTo = {};            
              $scope.crearDestinatario = function (){
               // alert( $scope.jsonFacturacion.cliente)
                 $scope.jsonDestinosBillTo.clienteId = parseInt(window.localStorage.getItem('clienteCache'));
                 $scope.jsonDestinosBillTo.idCliente = parseInt(window.localStorage.getItem('clienteCache'));
                  //$scope.jsonDestinosBillTo.segmentos =$scope.jsonFacturacion.segmento;
                  $scope.jsonDestinosBillTo.segmentos =$scope.selected;
                  $scope.jsonDestinosBillTo.usuarioActualizacion= $scope.login.usuario 
                console.log(angular.toJson($scope.jsonDestinosBillTo, true));  

                 $http.post('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/destinatarios_remitentes/save',$scope.jsonDestinosBillTo)
                       
                        .error(function(data, status, headers, config){
                             console.log("error ===>");
                              console.log(status);
                              console.log(data);
                              console.log(headers);
                              console.log(config);                  
                        })
                        .then(function(response){
                         
                         $scope.respuesta= response.data;
                         console.log("respuesta =>");
                         console.log($scope.respuesta);
                        
                          if ($scope.respuesta.mensajes.severidadMaxima != 'INFO') {
                            alert("error" + $scope.respuesta.mensajes.mensajes[0].texto )

                           }else{
                              $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/'+contexto+'/ordenes/segmentos-x-cliente-x-tipo_servicio?id_cliente='+window.localStorage.getItem('clienteCache')+'&id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio )
                                  
                                  .error(function(data, status, headers, config){
                                   // alert("**** Verificar conexion a internet ****");
                                    console.log("error ===>");
                                    console.log(status);
                                    console.log(data);
                                    console.log(headers);
                                    console.log(config);
                                  })
                                  .then(function(response){
                             
                                    $scope.segmento= response.data;
                                   console.log("json cargado segmento ===> " );
                                   console.log($scope.segmento) ; 

                                   $rootScope.segmento = []; 
                                   $rootScope.segmento =$scope.segmento; 
                                   $scope.cerrarModal();
                                   console.log("paso");

                            });  

                             
                          }
                         
                   });  


              }

              
        }
 

}]);

  