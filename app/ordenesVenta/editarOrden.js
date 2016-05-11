'use strict';

angular.module('myApp.editarOrden', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/editarOrden', {
    templateUrl: 'ordenesVenta/editarOrden.html',
    controller: 'editarOrdenCtrl'
  });
}])

.controller('editarOrdenCtrl',  [ '$scope', '$http','datatable','$mdDialog','$mdMedia','$mdToast','$location','Scopes','$rootScope' , '$q','$base64',function($scope  , $http ,datatable ,  $mdDialog, $mdMedia , $mdToast ,$location ,Scopes  , $rootScope , $q , $base64) {
  
  Scopes.store('editarOrdenCtrl', $scope);
  $scope.mensajeServidor = []; 
  $scope.myDate  =  new Date();  
  $scope.minDate = new Date(
  $scope.myDate.getFullYear(),
  $scope.myDate.getMonth() ,
  $scope.myDate.getDate());  
  $scope.maxDate = new Date(
  $scope.myDate.getFullYear(),
  $scope.myDate.getMonth() + 2,
  $scope.myDate.getDate());
 
  $scope.ubicarEnTab =function (){
       if(edicionNueva  === 'no'){           
            $scope.dataTabs.tabSeleccionada =0;
          }else{            
            $scope.dataTabs.tabSeleccionada =1;                                
        }
  }
  
  $scope.file_changed = function(element) {
        var photofile = element.files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
            $scope.$apply(function() {
                $scope.prev_img = e.target.result;
                $scope.encoded = $base64.encode($scope.prev_img);
                console.log("foto");
                console.log( $scope.encoded);
            });
        };
        reader.readAsDataURL(photofile);        
        console.log(photofile);
  };

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
      $scope.login.id  = $scope.usuario.id;
      $scope.bloquearBotonGuardar =  false ; 
     // $scope.jsonRespuesta = Scopes.get('loginCtrl').jsonRespuesta ; 
  }

  var textoProductoOrden = "";
   // $scope.login = Scopes.get('loginCtrl').login ; 
  //$scope.jsonRespuesta = Scopes.get('loginCtrl').jsonRespuesta ; 
  //$scope.login.id = $scope.jsonRespuesta.usuario.id ; 

  $scope.dataTabs = {};
  $scope.seleccionada  = 1 ; 

  if(edicionNueva  === 'no'){
      console.log("EDICION NUEVA NO");
      $scope.ordenSeleccionada = Scopes.get('listaOrdenesCtrl').ordenSeleccionada ;
      console.log("orden seleccionada");
      console.log($scope.ordenSeleccionada) ;
      $scope.dataTabs.tabSeleccionada =0;
  }else{
      console.log("EDICION NUEVA SI");
      $scope.dataTabs.tabSeleccionada =1;
      $scope.ordenSeleccionada = {};
      $scope.ordenSeleccionada.idOrden =  Scopes.get('ordenesVentaCtrl').jsonFacturacionRetorno.orden.idOrden; 
      $scope.ordenSeleccionada.idTipoServicio =  Scopes.get('ordenesVentaCtrl').jsonFacturacionRetorno.orden.datosFacturacion.tipoServicio;
      console.log("orden ==> ");
      console.log(Scopes.get('ordenesVentaCtrl').jsonFacturacionRetorno.orden); 
  }


  $scope.cambiaEstado = function (){
    $scope.dataTabs.tabSeleccionada = 1 ;
  }

  $scope.entregas = [
                      { id:  1 , nombre :'Manifiesto de importación',checked :false},
                      { id:  2 , nombre :'Certificado de Calidad',checked :false},
                      { id:  3 , nombre :'Certificado Invima',checked :false},
                      { id:  4 , nombre :'Albarán',checked :false}
                    ];

  $scope.maquila = [
                    { id:  1 , nombre :'Estampillado',checked :false},
                    { id:  2 , nombre :'Termoformado',checked :false},
                    { id:  4 , nombre :'Armado de ofertas',checked :false},
                    { id:  3 , nombre :'Desensamble de ofertas.',checked :false},
                    { id:  5 , nombre :'Colocación de etiquetas salud',checked :false},
                    { id:  6 , nombre :'Colocación de etiquetas importe ',checked :false},
                    { id:  7 , nombre :'Colocación de etiquetas distribuido',checked :false}
                  ];

  $scope.selected = [];
  $scope.selected1 = [];
  $scope.toggle = function (item, list) {                
                  var idx = list.indexOf(item);
                  if (idx > -1) {
                    list.splice(idx, 1);
                  }
                  else {
                    list.push(item);
                  }
                  console.log("seleccionados =>");
                  console.log($scope.selected);
  };
               
  $scope.exists = function (item, list) {
                  return list.indexOf(item) > -1;
  };

  $scope.toggle1 = function (item, list) {              
    var idx = list.indexOf(item);
    if (idx > -1) {
      list.splice(idx, 1);
    }
    else {
      list.push(item);
    }
  };
  $scope.exists1 = function (item, list) {
    return list.indexOf(item) > -1;
  };

  $scope.mostrarEditar =  0;
  $scope.mostrarEliminar =  0;
  $scope.data = {};
  $scope.data.info = 0 ; 
  $scope.cantidadTotal  =  0 ; 
  $scope.admiteBodegasDestino  = 0 ; 

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
      //$state.go('/ordenesVenta');        
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

  $scope.obtenerValorMascara = function (val) {                                              
    return  '$ '+val.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1.');                                              
  }; 

  $scope.crearOrden = function (){      
    $location.path('/ordenesVenta');
  }

  $scope.crearOrden = function (){
    $location.path('/ordenesVenta');
  }

  $rootScope.contarProductosPorUnidad = function (lineas){
    $rootScope.textoUnidadesProducto = "";
    $scope.cantidadTotal = 0;
    $scope.valorTotalLineas = 0;
    $scope.valorTotalLineasTexto = "";
    $scope.textosUnidades = [];
    $scope.lineas = lineas ;
    $scope.unidadesValores = [];
    $scope.posicion = 0 ; 
    for (var i = 0; i < $scope.lineas.length ; i++) {
      if($scope.unidadesValores.length === 0){
            $scope.unidadesValores  = $scope.unidadesValores.concat([
                                                                     {
                                                                       nombre : $scope.lineas[i].nombreUnidad  ,
                                                                        cantidad : $scope.lineas[i].cantidad
                                                                      }
                                                                    ]);
      }else{
        for (var j = 0; j < $scope.unidadesValores.length; j++) {
          console.log( $scope.unidadesValores[j].nombre +" vs "+  $scope.lineas[i].nombreUnidad )  ; 
          if($scope.unidadesValores[j].nombre === $scope.lineas[i].nombreUnidad){
            console.log("entra true");
            $scope.agregarUnidadNueva = 1; 
            $scope.unidadesValores[j].cantidad = $scope.unidadesValores[j].cantidad  + $scope.lineas[i].cantidad;                                                                                
            j = $scope.unidadesValores.length+1;                                                               
          } else{
            console.log("entra false");
            $scope.agregarUnidadNueva = 0;                                                                                                        
          }    
        }                                                                          
        if($scope.agregarUnidadNueva === 0 ){      
          console.log("es diferente");
          $scope.unidadesValores  = $scope.unidadesValores.concat([
                                          {
                                            nombre : $scope.lineas[i].nombreUnidad  ,
                                            cantidad : $scope.lineas[i].cantidad
                                          }
                                    ]);
          // console.log(angular.toJson( $scope.unidadesValores, true));                                                    
        }                            
      } 

        $scope.cantidadTotal += $scope.lineas[i].cantidad ;               
        if($scope.lineas[i].valorDeclaradoPorUnidad  != ""  || $scope.lineas[i].valorDeclaradoPorUnidad  != null || $scope.lineas[i].valorDeclaradoPorUnidad  != undefined  ){
          $scope.valorTotalLineas += $scope.lineas[i].valorDeclaradoPorUnidad *  $scope.lineas[i].cantidad ; 
           
        }
                                    
     }
     valorTotalLineas = parseInt( $scope.valorTotalLineas ); 
    // alert("valor es = " +valorTotalLineas) ; 
    $scope.valorTotalLineasTexto = $scope.obtenerValorMascara(valorTotalLineas) ;

       for (var i = 0 ; i < $scope.unidadesValores.length ; i++) {
          $rootScope.textoUnidadesProducto += $scope.unidadesValores[i].nombre + ":" + $scope.unidadesValores[i].cantidad + ", " ;         
          $scope.jsonTempo  = {};
          $scope.jsonTempo.cantidad = $scope.unidadesValores[i].cantidad ;  
          $scope.jsonTempo.nombre = $scope.unidadesValores[i].nombre ;
          $scope.textosUnidades.push($scope.jsonTempo);               
       }

       $rootScope.textoUnidadesProducto = $rootScope.textoUnidadesProducto.substr(0 , $rootScope.textoUnidadesProducto.length - 2 );          
       console.log("array textos " ) ;
       console.log(  $scope.textosUnidades)  ;
       console.log("texto completo   = " +  $rootScope.textoUnidadesProducto );

    }

  /*************************Objeto que  alamance la  io y el  puerto al cual conectarme****************************/
    $scope.serverData = {};
    //$scope.serverData.ip = "inglaterra";    
    //$scope.serverData.puerto = "8080";
    $scope.serverData.ip = hostName;
    $scope.serverData.puerto = puerto;
    $scope.serverData.usuario =  window.localStorage.getItem("idUsuario") ;
    $scope.tipoUbicacion = "" ;      
    $scope.dis = {};
    $scope.dis.tabEntrega = true ;     
    /*********************************Carga los tipos de sevicio por usaurio  ****************************************************/
    $scope.cargaTipoServicio =  function (){
         $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/'+contexto+'/ordenes/tipos_servicio-x-usuario?id_usuario='+$scope.serverData.usuario)             
              .error(function(data, status, headers, config){
                console.log("error ===>");
                console.log(status)
                console.log(data);
                console.log(headers);
                console.log(config);            
              })
              .then(function(response){
               
               $scope.tipoServicioData = response.data;
              console.log("json cargado tipos de servicio por cliente ===>");
              console.log($scope.ordenSeleccionada);
              console.log("list tipo servicio ==>");
              console.log( $scope.tipoServicioData);
              if(edicionNueva  === 'no'){
                 
                  $scope.ordenSeleccionada.idTipoServicio = $scope.jsonEdicion.datosFacturacion.tipoServicio;

              }
               for (var i = 0 ; i < $scope.tipoServicioData.length ; i++) {

                 console.log("entra al for " + $scope.ordenSeleccionada.idTipoServicio )
                        if(parseInt($scope.ordenSeleccionada.idTipoServicio) === parseInt($scope.tipoServicioData[i].id)){
                            console.log("entro a if ==>" + $scope.tipoServicioData[i].nombre ) ; 
                            $scope.nombreTipoServicio = $scope.tipoServicioData[i].nombre ;  
                            console.log("registar destino en la orden  = " + $scope.tipoServicioData[i].registrarDesitinoEnLaOrden  );                         

                                  if($scope.tipoServicioData[i].tipoUbicacionOrden === 'DIRECCION')
                                  {
                                    $scope.tipoUbicacion  = 'DIRECCION' ; 
                                    console.log("HABILITAR SHIP TO  tipo ubicacion");
                                  }else{
                                    $scope.tipoUbicacion  = 'BODEGA';
                                    console.log("HABILITAR SHIP TO  BODEGA tipo ubicacion ");
                                  }

                                   if($scope.tipoServicioData[i].tipoUbicacionLineaOrden === 'DIRECCION')
                                  {
                                    $scope.tipoUbicacionLineaOrden  = 'DIRECCION' ; 
                                    console.log("HABILITAR SHIP TO  ubicacion linea orden ");
                                  }else{
                                    $scope.tipoUbicacionLineaOrden  = 'BODEGA';
                                    console.log("HABILITAR SHIP TO  BODEGA  ubicacion linea orden  ");
                                  }
                                  
                                  if($scope.tipoServicioData[i].rolUbicacionOrden === 'DESTINO')
                                  {
                                    $scope.origenDestinoTitulo  = 'Destino' ; 
                                    console.log("TITULO DESTINO ");
                                  }else{
                                    $scope.origenDestinoTitulo  = 'Origen';
                                    console.log("TITULO ORIGEN ");
                                  }                 
                      }
              }
         });    

    }
        

	  $scope.jsonFacturacion = {};
    $scope.jsonFacturacionEnvio = [];
    $scope.jsonEnvio = {};
    $scope.jsonEnvioEnvio = [];
    $scope.jsonEntrega =[];
    $scope.jsonEntregaEnvio=[];
    $scope.jsonEntregaProducto=[];
 
/***********************Tabla edicion de productos*********************************/
    var producto  = "";
    var idLineaOrden = "";
    var bodega = "";
    var cantidad = "" ; 
    var unidad = "";
    var lote ="";
    var notas ="";
    var alto = "";
    var largo = "";
    var ancho = "";
    var volumen = "";
    var total = "";
    var pesoBruto  ="";
    var totalKilos = "";
    var pesoVolumetrico = "";
    var totalVolumen = "";
    var valorDeclarado ="";
    var totalDeclarado = "";
    var idProductoEdit = "";
    var nombreProducto = "";
    var idUnidadMedidaEdicion = "";
    var nombreUnidadMedidaEdicion = "";
    var codigoProducto = "";
    var cantidadResta  = "";
    var  valorTotalLineas = 0;
    var numeroResta  = 0 ; 
    var unidadDependiente = 0  ; 
    
    var ciudadNombreAlterno = "";
    var codigoBodegaAlterno = "";
    var nombreBodegaAlterno = "";
    var codigoProductoAlterno = "";
    var nombreProductoAlterno = "";
    var codigoUnidadAlterno = "";

    $scope.bloquearBotonGuardar =  false ; 

    $rootScope.mostrarValorDeclarado = true;
    console.log('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/'+contexto+'/ordenes/'+$scope.ordenSeleccionada.idOrden)     
    $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/'+contexto+'/ordenes/'+$scope.ordenSeleccionada.idOrden)     
    
              .error(function(data, status, headers, config){
                console.log("error ===>");
                console.log(status);
                console.log(data);
                console.log(headers);
                console.log(config);
            
              })
              .then(function(response){              
                $scope.jsonEdicion= response.data;  
                console.log("llega a edicion ==>") ; 
                console.log(response.data) ;      
                $rootScope.cargarProductosCliente($scope.jsonEdicion.datosFacturacion.cliente,$scope.jsonEdicion.datosFacturacion.tipoServicio);
               //verificar valor declarado 
                console.log("lineas");
                console.log($scope.jsonEdicion.lineas);   

                for (var i = 0; i < $scope.jsonEdicion.lineas.length; i++) {                
                   if($scope.jsonEdicion.lineas[i].valorDeclaradoPorUnidad  !=  null){
                      $rootScope.mostrarValorDeclarado = false;

                   }
                }

                if($rootScope.mostrarValorDeclarado){
                  console.log("NO hay valor declarado en ninguna linea");
                }else{
                  console.log("Ya existe un valor declarado en la linea")

                }

               /*********Valida alternos en datos facturacion***********************/
               $scope.jsonFacturacion =  $scope.jsonEdicion.datosFacturacion ;
               $scope.dest.selectedItem ={}                    
               $scope.dest.selectedItem.nombre  =  $scope.jsonFacturacion.nombreDestinatario;
               $scope.dest.selectedItem.id = $scope.jsonFacturacion.destinatario;

               $scope.mostrarAlternoBillToSegmento = false;
               if($scope.jsonFacturacion.codigoAlternoSegmento != null ||
                  $scope.jsonFacturacion.codigoAlternoSegmento != ''  ){
                  $scope.mostrarAlternoBillToSegmento = false;                
               }else{
                  $scope.mostrarAlternoBillToSegmento = true;
               }

               $scope.mostrarAlternoBillToDestinatario = false;
               if($scope.jsonFacturacion.nombreAlternoDestinatario != null ||
                  $scope.jsonFacturacion.nombreAlternoDestinatario != '' || 
                  $scope.jsonFacturacion.nombreAlternoDestinatario != null ||
                  $scope.jsonFacturacion.nombreAlternoDestinatario != '' ||
                  $scope.jsonFacturacion.numeroIdentificacionAlternoDestinatario != null ||
                  $scope.jsonFacturacion.numeroIdentificacionAlternoDestinatario != '' ){
                  $scope.mostrarAlternoBillToDestinatario = false;
               }else{
                  $scope.mostrarAlternoBillToDestinatario = true;
               }
               /*********fin  alternos en datos facturacion***********************/

               $scope.cargaTipoServicio();
          
                
               $scope.jsonEnvio = $scope.jsonEdicion.destinoOrigen  ; 

               /*********Valida alternos en destinoOrigen***********************/
                $scope.mostrarAlternoShipToCiudad = false;
                if($scope.jsonEnvio.ciudadCodigoAlterno != null ||
                   $scope.jsonEnvio.ciudadCodigoAlterno != ''  || 
                   $scope.jsonEnvio.ciudadNombreAlterno != null ||
                   $scope.jsonEnvio.ciudadNombreAlterno != ''){
                  $scope.mostrarAlternoShipToCiudad = false;

                }else{
                    $scope.mostrarAlternoShipToCiudad = true;

                }

                $scope.mostrarAlternoShipToDestino= false;
                if($scope.jsonEnvio.destinoCodigoAlterno  != null ||
                   $scope.jsonEnvio.destinoCodigoAlterno != '' || 
                   $scope.jsonEnvio.destinoNombreAlterno != null ||
                   $scope.jsonEnvio.destinoNombreAlterno != '' ){
                  $scope.mostrarAlternoShipToDestino= false;

                }else{
                  $scope.mostrarAlternoShipToDestino= true;

                }

          /*********FIN Valida alternos en destinoOrigen***********************/

          /**************Valida alternos Bodega destino origen ******************************/
          $scope.bodegaDestinoOrigen  =  $scope.jsonEdicion.bodegaDestinoOrigen;
           $scope.mostrarAlternoShipToDestinoBodega= false;
           if($scope.bodegaDestinoOrigen.bodegaCodigoAlterno != null || 
              $scope.bodegaDestinoOrigen.bodegaCodigoAlterno != ''   ||
              $scope.bodegaDestinoOrigen.bodegaNombreAlterno != null ||
              $scope.bodegaDestinoOrigen.bodegaNombreAlterno != ''){
              $scope.mostrarAlternoShipToDestinoBodega= false;

           }else{
              $scope.mostrarAlternoShipToDestinoBodega= true;
           }

           $scope.mostrarAlternoShipToBodegaCiudad= false;
           if($scope.bodegaDestinoOrigen.ciudadCodigoAlterno  != null ||
              $scope.bodegaDestinoOrigen.ciudadCodigoAlterno  != ''  ||
              $scope.bodegaDestinoOrigen.ciudadNombreAlterno  != null   || 
              $scope.bodegaDestinoOrigen.ciudadNombreAlterno  != ''  ) {
              $scope.mostrarAlternoShipToBodegaCiudad= false;
           }else{
            $scope.mostrarAlternoShipToBodegaCiudad= true;
           }

              /**************Valida alternos Bodega destino origen ******************************/

           $scope.jsonEntrega  = $scope.jsonEdicion.datosEntregaRecogida;
           var dateResP   = new Date($scope.jsonEntrega.fechaMaxima);
           if(dateResP.getFullYear() === 1969){
              $scope.jsonEntrega.fechaTexto =  "No confirmada";

           }else{
            $scope.jsonEntrega.fechaTexto =  " "+ dateResP.getDate() + "/"+  (dateResP.getMonth()+1) + "/" +   dateResP.getFullYear();
           }
           


           $scope.lineas = $scope.jsonEdicion.lineas ; 
           $scope.jsonOtros = $scope.jsonEdicion.datosOtros;
           if($scope.jsonEdicion.datosEntregaRecogida.fechaMaxima != null ){
              if($scope.jsonEdicion.datosEntregaRecogida.fechaMinima === $scope.jsonEdicion.datosEntregaRecogida.fechaMaxima ){
                
                $scope.data.info =  0;
                $scope.jsonEntrega.fechaMaxima =  new Date($scope.jsonEdicion.datosEntregaRecogida.fechaMaxima);
                $scope.jsonEntrega.fechaMinima =  new Date($scope.jsonEdicion.datosEntregaRecogida.fechaMinima);
                console.log("fecha  unica");
              
            }else if($scope.jsonEdicion.datosEntregaRecogida.fechaMinima === null) {// if ($scope.jsonEdicion.datosEntregaRecogida.fechaMaxima != $scope.jsonEdicion.datosEntregaRecogida.fechaMinima){
                 
                $scope.data.info =  0;
                $scope.jsonEntrega.fechaMaxima =  new Date($scope.jsonEdicion.datosEntregaRecogida.fechaMaxima);
                $scope.jsonEntrega.fechaMinima =  new Date($scope.jsonEdicion.datosEntregaRecogida.fechaMaxima);
                console.log("fecha  unica 2");

            }else{
               $scope.data.info =  0;
                $scope.jsonEntrega.fechaMaxima =  new Date($scope.jsonEdicion.datosEntregaRecogida.fechaMaxima);
                $scope.jsonEntrega.fechaMinima =  new Date($scope.jsonEdicion.datosEntregaRecogida.fechaMinima);
                console.log("fecha rango fecha");
            }
           }else{
                $scope.data.info =  3;
                $scope.jsonEntrega.fechaMaxima =  null;
                $scope.jsonEntrega.fechaMinima = null;
                console.log("fecha  no confirmada");                 
           }
        
           $scope.cargaClientes();
           $scope.cargaDestinatarios();
           $scope.cargaSegmentos();               
           $scope.cargaCiudadEnvio(0,0);
           $scope.cargaDestinosEnvio();
           $scope.cargaInfoDestinoEnvio();
           $scope.cargarConfiguracion();
           $scope.cargaCiudadEnvioShiptToBodega();
           $scope.cargaFormasDePago();
           $rootScope.contarProductosPorUnidad($scope.lineas);
           $scope.gridOptions ={};
           $scope.gridOptionsDisponibilidad ={};

           $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/'+contexto+'/ordenes/productos-x-cliente?id_cliente='+$scope.jsonEdicion.datosFacturacion.cliente+'&id_tipo_servicio='+$scope.jsonEdicion.datosFacturacion.tipoServicio)                  
              .error(function(data, status, headers, config){
                   console.log("error ===>");
                    console.log(status);
                    console.log(data);
                    console.log(headers);
                    console.log(config);
            
              })
              .then(function(response){
               
                $scope.productosCliente= response.data;
                console.log("json cargado productos ===> " );
              
                  for (var i =0; i < $scope.productosCliente.length; i++) {
                     $scope.dataCombo= $scope.dataCombo.concat(
                                                                {
                                                                  id:$scope.productosCliente[i].id , 
                                                                  value : $scope.productosCliente[i].nombre
                                                                }
                                                            );
                   }
            }); 

      console.log("Data combo");
      console.log($scope.dataCombo);
        /****************CArga tablas ***********************/
      $scope.columnDefsDisponibilidad = [
              {field:'ciudad', displayName: 'Ciudad',visible: true , width : '50%',enableColumnResizing: false , enableCellEdit: false},
              {field:'cantidad', displayName: 'Disponible',visible: true , width : '50%',enableColumnResizing: false , enableCellEdit: false}
      ];

    /**************************Cargar disponibles producto*************************************************/
      $scope.getDisponibles =function (id,cliente){

        $scope.clienteData = Scopes.get('listaOrdenesCtrl').clientes ; 
        console.log($scope.clienteData);          
        console.log("cliente");
        console.log(cliente);        
        console.log("id");
        console.log(id);        
        $scope.valor = ""  ; 
        for (var i = 0; i < $scope.clienteData.length ;  i++) {
           if(cliente === $scope.clienteData[i].codigo){
              $scope.valor = $scope.clienteData[i].nombreComercial
           }   
        }
        console.log("valor  para el envio")
        console.log($scope.valor);

        console.log('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/serviciosTactic/consultaDisponibles?idProducto='+id+"&nombreCliente="+$scope.valor);
        $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/serviciosTactic/consultaDisponibles?idProducto='+id+"&nombreCliente="+$scope.valor)
      
              
              .error(function(data, status, headers, config){
                
                console.log("error ===>");
                console.log(status);
                console.log(data);
                console.log(headers);
                console.log(config);
            
              })
              .then(function(response){
               
               $scope.disponiblesProducto = response.data;
               console.log("json cargado disponibles producto ===> " );
               console.log($scope.disponiblesProducto) ;
               $scope.gridOptionsDisponibilidad.data =  []; 
              $scope.gridOptionsDisponibilidad.data =  $scope.disponiblesProducto ; 

          }); 


      }   

        /**************************Carga unidades por producto*************************************************/
         $scope.cargaUnidadesProd = function (id){
               console.log('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/ordenes/unidades-x-producto?id_producto='+id); 
               $http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/ordenes/unidades-x-producto?id_producto='+id)
                   
                    .error(function(data, status, headers, config){
                         console.log("error ===>");
                          console.log(status);
                          console.log(data);
                          console.log(headers);
                          console.log(config);
                  
                    })
                    .then(function(response){
                     
                      $scope.unidadesProducto= response.data;
                      console.log("json cargado unidades producto ===> " )                     
                      console.log($scope.unidadesProducto) ;

                      $scope.dataComboUnidades = [];
                      for (var i =0; i < $scope.unidadesProducto.length; i++) {
                         $scope.dataComboUnidades= $scope.dataComboUnidades.concat(
                                                                    {
                                                                      id:   $scope.unidadesProducto[i].id  , 
                                                                      value : $scope.unidadesProducto[i].nombre                                                               
                                                                    }
                                                                );
                      }
                                       
                      $scope.gridOptions.columnDefs[3].editDropdownOptionsArray =  $scope.dataComboUnidades;
                      $scope.gridOptions.columnDefs[3].editDropdownIdLabel  = 'id';
                });    
              }


      $scope.obtenerNombreUnidad = function (value ){
        //alert("entr aa validar" + value);
        
           if(value === 'UNIDAD' ){     
          
                return 1;
            }  
            if(value === 'CAJA' ){    
              
               return  2 ;
            }
            if(value === 'KILO' ){    
          
                return  4  ;
            }
      }

      $scope.editarProducto = {}; 
      $scope.editarProducto.prod = "";
            $scope.columnDefs= [
                                  {field:'numeroItem', displayName: 'Línea',visible: true , width : '8%',enableColumnResizing: false , enableCellEdit: false},
                                  {field:'codigoProducto', displayName: 'Producto' ,visible: true , width : '44%',enableColumnResizing: false,enableCellEdit: true,editableCellTemplate: 'ui-grid/dropdownEditor'  ,cellFilter: 'productoFilter: this ' },                                   
                                  {field:'cantidad', displayName: 'Cantidad' ,visible: true , width : '10%',enableColumnResizing: false,enableCellEdit: true, cellClass:'derecha' },                                                         
                                  {field:'unidad', displayName: 'Unidad',visible: true , width : '10%',enableColumnResizing: false,enableCellEdit: true , editableCellTemplate: 'ui-grid/dropdownEditor',cellFilter: 'medidaFilter:this' },
                                  {field:'codigoUnidad', displayName: 'Nombre unidad',visible: false,enableColumnResizing: false,enableCellEdit: true},                                                            
                                  {field:'lote', displayName: 'Lote/Serial' ,visible: true , width : '10%',enableColumnResizing: false,enableCellEdit: true} ,                                                         
                                  {field:'valorDeclaradoPorUnidad', displayName: 'Valor venta', width : '15%' , visible: true,enableColumnResizing: false,enableCellEdit: true ,cellFilter: 'currencyFilter:this'  ,cellClass:'derecha'  },                                         
                                  {field:'valorVenta', displayName: 'Precio de venta unitario',visible: false,enableColumnResizing: false,enableCellEdit: true ,cellClass:'derecha'},
                                  {field:'nombreProducto', displayName: 'Nombre producto',visible: false , width : '12%',enableColumnResizing: false,enableCellEdit: true},                                                            
                                  {field:'codigoUnidadAlterno', displayName: 'Unidad alterno',visible: false, width : '16%',enableColumnResizing: false,enableCellEdit: true},                                                      
                                  {field:'codigoBodega', displayName: 'Bodega' ,visible:false , width : '12%',enableColumnResizing: false,enableCellEdit: true}, 
                                  {field:'nombreBodega', displayName: 'Nombre bodega' ,visible: false , width : '12%',enableColumnResizing: false,enableCellEdit: true},                                
                                  {field:'notas', displayName: 'Notas',visible: false , width : '40%',enableColumnResizing: false,enableCellEdit: true},                              
                                  {field:'usuario', displayName: 'usuario',visible: false , width : '12%',enableColumnResizing: false,enableCellEdit: true},
                                  {field:'fechaActualizacion', displayName: 'Fecha actualización',visible: false , width : '18%',enableColumnResizing: false,enableCellEdit: true},
                                  {field:'codigoProductoAlterno', displayName: 'Producto alterno' ,visible: false, width : '16%',enableColumnResizing: false,enableCellEdit: true},
                                  {field:'bodega', displayName: 'Bodega' , visible: false,enableColumnResizing: false,enableCellEdit: true},                                                                                     
                                  {field:'disponibilidad', displayName: 'Disponibilidad',visible: false,enableColumnResizing: false,enableCellEdit: true},                            
                                  {field:'idLineaOrden', displayName: 'Id linea orden' ,visible: false,enableColumnResizing: false,enableCellEdit: true},
                                  {field:'idOrden', displayName: 'Id  orden' ,visible: false,enableColumnResizing: false,enableCellEdit: true},
                                  {field:'idUsuario', displayName: 'Id  usuario' ,visible: false,enableColumnResizing: false,enableCellEdit: true},                                                                                                                                     
                                  {field:'producto', displayName: 'producto',visible: false,enableColumnResizing: false,enableCellEdit: true},
                                  {field:'unidad', displayName: 'unidad',visible: false,enableColumnResizing: false,enableCellEdit: true},
                                  {field:'altoPorUnidad', displayName: 'alto unidad',visible: false,enableColumnResizing: false,enableCellEdit: true},
                                  {field:'anchoPorUnidad', displayName: 'anchoPorUnidad',visible: false,enableColumnResizing: false,enableCellEdit: true},
                                  {field:'anchoPorUnidad', displayName: 'anchoPorUnidad',visible: false,enableColumnResizing: false,enableCellEdit: true},
                                  {field:'largoPorUnidad', displayName: 'largoPorUnidad',visible: false,enableColumnResizing: false,enableCellEdit: true},
                                  {field:'pesoBrutoPorUnidad', displayName: 'pesoBrutoPorUnidad',visible: false,enableColumnResizing: false,enableCellEdit: true},                                            
                                  {field:'ciudadNombreAlterno', displayName: 'ciudadNombreAlterno',visible: false,enableColumnResizing: false,enableCellEdit: true},
                                  {field:'codigoBodegaAlterno', displayName: 'codigoBodegaAlterno',visible: false,enableColumnResizing: false,enableCellEdit: true},
                                  {field:'nombreBodegaAlterno', displayName: 'nombreBodegaAlterno',visible: false,enableColumnResizing: false,enableCellEdit: true},
                                  {field:'codigoProductoAlterno', displayName: 'codigoProductoAlterno',visible: false,enableColumnResizing: false,enableCellEdit: true},
                                  {field:'nombreProductoAlterno', displayName: 'nombreProductoAlterno',visible: false,enableColumnResizing: false,enableCellEdit: true}
   
                                ];
                  /*function rowTemplate() {
                                return '<div ng-dblclick="grid.appScope.rowDblClick(row)" >' +
                                             '  <div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>' +
                                             '</div>';
                  };*/
                  $scope.rowDblClick = function(){
                    $scope.editarLinea();
                  }  
                   $scope.gridOptionsDisponibilidad = {
                                // enableRowHeaderSelection: false,
                                //selectedItems: $scope.selections,
                                //enableRowSelection: true,
                                enableColumnResize: true,
                                columnDefs : $scope.columnDefsDisponibilidad
                                //enableRowSelection: true , 
                                // rowTemplate: rowTemplate()     
                  }          
                  $scope.gridOptions = {
                              // enableRowHeaderSelection: false,
                              //selectedItems: $scope.selections,
                              //enableRowSelection: true,
                              rowSelection: true, 
                              enableColumnResize: true,
                              columnDefs : $scope.columnDefs
                              //enableRowSelection: true , 
                              // rowTemplate: rowTemplate()     
                  }
                  $scope.saveRow = function (rowEntity){
                      // create a fake promise - normally you'd use the promise returned by $http or $resource
                     // var promise = $q.defer();
                   $scope.bloquearBotonGuardar =  true ; 
                     console.log(rowEntity);                 
                     var promise = $q.defer();

                     $scope.productoAddTabla = {};
                     $scope.productoAddTabla.idLineaOrden  = rowEntity.idLineaOrden;
                     $scope.productoAddTabla.numeroItem = rowEntity.numeroItem;
                     $scope.productoAddTabla.linea = rowEntity.idLineaOrden,
              
                     $scope.productoAddTabla.cantidad = rowEntity.cantidad ; 
                     $scope.valorTotalLineas += parseInt(rowEntity.valorDeclaradoPorUnidad) * parseInt(rowEntity.cantidad) ; 
                     valorTotalLineas = $scope.valorTotalLineas ; 
                     $scope.valorTotalLineasTexto = $scope.obtenerValorMascara(valorTotalLineas) ;
                     //$scope.cantidadTotal += rowEntity.cantidad ; 
                     $scope.productoAddTabla.unidad = rowEntity.unidad ; 
                     $scope.productoAddTabla.lote = rowEntity.lote;
                     $scope.productoAddTabla.valorVenta = rowEntity.valorDeclaradoPorUnidad;
                     rowEntity.idOrden =  parseInt($scope.ordenSeleccionada.idOrden);
                     $scope.productoAddTabla.idLineaOrden = rowEntity.idLineaOrden ;
                     var dataProdSplit =  rowEntity.codigoProducto.split("@");
                     
                     if(rowEntity.idLineaOrden === undefined){

                      rowEntity.producto=  parseInt(dataProdSplit[1]);
                       $scope.productoAddTabla.numeroItem = null ; 
                       $scope.productoAddTabla.idLineaOrden = null ;
                     }
                     if(dataProdSplit.length === 2){
                        rowEntity.producto=  parseInt(dataProdSplit[1]);

                     }
                     //alert("producto" +rowEntity.producto ) ; 
                   //  
                     
                     //rowEntity.numeroItem =  rowEntity.idLineaOrden;
                     rowEntity.nombreProducto =  rowEntity.codigoProducto;
                     rowEntity.codigoUnidad =  rowEntity.unidad;
                     rowEntity.nombreUnidad =  rowEntity.unidad;
                     rowEntity.bodega =  10;
                     rowEntity.codigoBodega =  "TL-BOG-SIB-01";
                     rowEntity.nombreBodega =  "BOG-CEDI SIBERIA 1";
                     rowEntity.idUsuario =parseInt($scope.login.id) ;
                     rowEntity.usuario =  $scope.login.usuario ;     

                     $scope.productoAddTabla.producto = rowEntity.producto;
                     $scope.productoAddTabla.codigoProducto = rowEntity.codigoProducto;  
                      
                     if(angular.isNumber(rowEntity.unidad)){
                      $scope.productoAddTabla.codigoUnidad = rowEntity.unidad;
                      //alert("por codigo  = "+ $scope.productoAddTabla.codigoUnidad);
                     }else{
                      $scope.productoAddTabla.codigoUnidad = $scope.obtenerNombreUnidad(rowEntity.unidad);
                      //alert("por nombre  = "+ $scope.productoAddTabla.codigoUnidad);
                     }
                     
                     
                    
                     console.log("id unidad");
                     console.log($scope.productoAddTabla.codigoUnidad);


                      $scope.jsonEntregaProducto=  [{
                                             idLineaOrden:$scope.productoAddTabla.idLineaOrden,
                                             idOrden :parseInt($scope.ordenSeleccionada.idOrden),
                                             numeroItem :  $scope.productoAddTabla.numeroItem,
                                             producto :  $scope.productoAddTabla.producto  , 
                                             codigoProducto :parseInt($scope.productoAddTabla.codigoProducto) ,
                                             nombreProducto : dataProdSplit[0] ,                                              
                                             cantidad :parseInt($scope.productoAddTabla.cantidad),
                                             unidad : parseInt($scope.productoAddTabla.codigoUnidad),//parseInt($scope.jsonProductoAdd.unidad),                                            
                                             bodega :null,                                        
                                             lote :$scope.productoAddTabla.lote ,
                                             notas :"",
                                             idUsuario:parseInt($scope.login.id),
                                             usuario:$scope.login.usuario ,
                                             valorDeclaradoPorUnidad : rowEntity.valorDeclaradoPorUnidad
                                        }];         

                    console.log(angular.toJson( $scope.jsonEntregaProducto, true));
                    promise.resolve(rowEntity);

                   
        console.log('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/ordenes/saveLineaOrden' , $scope.jsonEntregaProducto)

        $http.post('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/ordenes/saveLineaOrden' , $scope.jsonEntregaProducto)              
              .error(function(data, status, headers, config){
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
                if ($scope.jsonProductoRetorno.mensajes.severidadMaxima != 'INFO') {
                  alert("error" + $scope.jsonProductoRetorno.mensajes.mensajes[0].texto )

                 }else{
                       //$scope.imprimir();
                       console.log("json cargado retorno  productos ===> ");
                       console.log($scope.jsonProductoRetorno.orden.lineas);

                        for (var i = 0; i < $scope.jsonProductoRetorno.orden.lineas.length; i++) {
                  
                               if($scope.jsonProductoRetorno.orden.lineas[i].valorDeclaradoPorUnidad  !=  null){
                                  $rootScope.mostrarValorDeclarado = false;

                               }

                            }
                            if($rootScope.mostrarValorDeclarado){
                              console.log("NO hay valor declarado en ninguna linea");
                            }else{
                              console.log("Ya existe un valor declarado en la linea")

                            }



                       $rootScope.contarProductosPorUnidad($scope.jsonProductoRetorno.orden.lineas);
                       
                          $scope.cantidadTotal   = 0 ; 
                       for (var i = 0; i < $scope.jsonProductoRetorno.orden.lineas.length ; i++) {
                          $scope.cantidadTotal += $scope.jsonProductoRetorno.orden.lineas[i].cantidad ; 
                       }
                       console.log("cantidad total  = " + $scope.cantidadTotal);

                       $scope.gridOptions.data = [];
                       $scope.gridOptions.data = $scope.jsonProductoRetorno.orden.lineas;                    
                 }
           
             });  

                    $scope.gridApi.rowEdit.setSavePromise( rowEntity, promise.promise );
                    // $rootScope.contarProductosPorUnidad();
                    $scope.bloquearBotonGuardar =  false ; 
                    // fake a delay of 3 seconds whilst the save occurs, return error if gender is "male"
                   

                  }
                     $scope.gridOptionsDisponibilidad.onRegisterApi = function( gridApi ) {

                     }
                 $scope.gridOptions.multiSelect = false;
                 $scope.gridOptions.onRegisterApi = function( gridApi ) {
                            $scope.gridApi = gridApi; 
                             $scope.gridApi.selection.on.rowSelectionChanged($scope, function(row){                             
                             // console.log(row.entity);
                               idLineaOrden =  row.entity.idLineaOrden ; 
                               $scope.mostrarEliminar =  1;
                               cantidadResta = row.entity.valorDeclaradoPorUnidad ; 
                               codigoProducto =row.entity.codigoProducto  
                               numeroResta   = row.entity.cantidad ;                                                     
                               $scope.getDisponibles(codigoProducto ,$scope.ordenSeleccionada.cliente);
                            });
                               gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
                                    console.log(rowEntity);
                                    var dataProdSplit1 =  rowEntity.codigoProducto.split("|");
                                    var dataCodProd=  dataProdSplit1[1].split("@");
                                    $scope.cargaUnidadesProd(dataCodProd[1]);  
                                  if( colDef.name === 'codigoProducto' ){
                                 
                                    //alert("entro codigo de producto "+ dataCodProd[0]);
                                    $scope.getDisponibles(dataCodProd[0].trim() ,$scope.ordenSeleccionada.cliente);

                                   // unidadDependiente  =  rowEntity.unidad;
                                   // alert("edicion prdocutnounidad" +unidadDependiente );
                                    //rowEntity.cantidad = 666; 
                                    /*if( newValue === 1 ){
                                      rowEntity.sizeOptions = $scope.maleSizeDropdownOptions;
                                    } else {
                                      rowEntity.sizeOptions = $scope.femaleSizeDropdownOptions;
                                    }*/
                                  }                                                                   
                                });
                            gridApi.edit.on.beginCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
                                console.log("coldef");
                                console.log(colDef);
                                //alert("entro" +rowEntity.producto );
                                $scope.cargaUnidadesProd(rowEntity.producto);                                                   
                            });

                            gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
                           
                          /*$scope.gridApi.selection.on.rowSelectionChanged($scope, function(row){
                              console.log("entra");
                              console.log( row.entity.idOrden);
                              $scope.ordenSeleccionada =  row.entity ; 
                              console.log(row);
                              console.log(row.entity.idLineaOrden);
                              console.log("producto seleccionado" + row.entity.nombreProducto  + "---" +row.entity.codigoProducto );
                              idLineaOrden =  row.entity.idLineaOrden ; 
                              producto = row.entity.codigoProducto;
                              bodega = row.entity.nombreBodega;
                              cantidad = row.entity.cantidad;
                              unidad = row.entity.nombreUnidad;
                              alto =  row.entity.altoPorUnidad ;
                              ancho =  row.entity.anchoPorUnidad;
                              largo = row.entity.largoPorUnidad;
                              pesoBruto = row.entity.pesoBrutoPorUnidad;
                              valorDeclarado = row.entity.valorDeclaradoPorUnidad; 
                              idProductoEdit = row.entity.producto;
                              nombreProducto = row.entity.nombreProducto;
                              idUnidadMedidaEdicion = row.entity.unidad;
                              nombreUnidadMedidaEdicion = row.entity.nombreUnidad;

                              ciudadNombreAlterno = row.entity.ciudadNombreAlterno;
                              codigoBodegaAlterno = row.entity.codigoBodegaAlterno;
                              nombreBodegaAlterno = row.entity.nombreBodegaAlterno;
                              codigoProductoAlterno = row.entity.codigoProductoAlterno;
                              nombreProductoAlterno = row.entity.nombreProductoAlterno;
                              codigoUnidadAlterno = row.entity.codigoUnidadAlterno;
                             // $scope.prodCli.nombreLargo =row.entity.nombreProducto;
                              lote = row.entity.lote;
                              notas  = row.entity.notas ;
                              $scope.mostrarEditar =  1;
                              $scope.mostrarEliminar =  1;
                            });*/
                      };

                             /**********in carga tablas ************************/

               $scope.gridOptions.data = [] ;
               $scope.gridOptions.data = $scope.lineas ;
            
               //$scope.gridApi.core.refresh();
              // console.log("data facturacion ");
              // console.log($scope.jsonFacturacion);
              // console.log($scope.jsonFacturacion.nombre);
        });    
   
   
    $scope.addData = function() {
      $scope.bloquearBotonGuardar =  true ; 
      $scope.valorn = $scope.gridOptions.data.length + 2;
      $scope.gridOptions.data.push({
                      "numeroItem": "",
                      "codigoProducto": "" ,
                      "cantidad": "0",
                      "unidad": "",
                      "lote": "",
                      "valorVenta": 0,
                      "valorDeclaradoPorUnidad": 0
                    });
         $scope.valorn = $scope.valorn + 1 ;
    };
  

    /************************Carga  info de  clientes  *******************************************/
      $scope.cargaClientes = function(){
        
        console.log('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/'+contexto+'/ordenes/clientes-x-usuario?id_usuario='+$scope.login.id+'&id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio)
        $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/'+contexto+'/ordenes/clientes-x-usuario?id_usuario='+$scope.login.id+'&id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio)
              
              .error(function(data, status, headers, config){
                
                console.log("error ===>");
                console.log(status);
                console.log(data);
                console.log(headers);
                console.log(config);
            
              })
              .then(function(response){
               
               $scope.clientes = response.data;
               console.log("json cargado cliente ===> " );
               console.log($scope.clientes) ; 

          });    
    }

      /***********************Carga json segmentos*******************************************/

      $scope.cargaSegmentos = function(){
        $scope.segmento= [];
        $scope.destinatario = [];              
        $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/'+contexto+'/ordenes/segmentos-x-cliente-x-tipo_servicio?id_cliente='+$scope.jsonFacturacion.cliente+'&id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio )             
              .error(function(data, status, headers, config){
                console.log("error ===>");
                console.log(status);
                console.log(data);
                console.log(headers);
                console.log(config);
            
              })
              .then(function(response){
                $scope.cargarConfiguracion();
                $scope.segmento= response.data;
               console.log("json cargado segmento ===> " );
               console.log($scope.segmento) ; 

        });          
    }

      /*************************Combo deestinartario por  tipo de servicio y clientes*******************************/
      $scope.destinatario = [];
      $scope.cargaDestinatarios = function (){
        console.log("entra cargar destinatarios");
        console.log('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/'+contexto+'/ordenes/destinatarios_remitentes-x-cliente?id_cliente='+$scope.jsonFacturacion.cliente+'&id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio +'&id_segmento='+$scope.jsonFacturacion.segmento);
         $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/'+contexto+'/ordenes/destinatarios_remitentes-x-cliente?id_cliente='+$scope.jsonFacturacion.cliente+'&id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio +'&id_segmento='+$scope.jsonFacturacion.segmento)              
            .error(function(data, status, headers, config){
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

        /*************************Combo ciudad*******************************************/
           
          $scope.mostrarMensajeCambiarDatos = function (){
                   for (var i = 0; i < $scope.destinatario.length; i++) {                              
                                         if(parseInt($scope.destinatario[i].id) === parseInt($scope.jsonFacturacion.destinatario)){
                                          //if(angular.equals($scope.destinatario[i].id, $scope.jsonFacturacion.destinatario)){
                                         // console.log("entra" +  $scope.destinatario.numeroIdentificacion );
                                            //$scope.jsonFacturacion.numeroDocumento =  $scope.destinatario[i].numeroIdentificacion;
                                            if( $scope.destinatario[i].contacto.nombres != "" && $scope.destinatario[i].contacto.telefonos != "" &&  $scope.destinatario[i].contacto.email != "" ){
                                                    $scope.jsonFacturacion.nombre  = $scope.destinatario[i].contacto.nombres ;
                                                    $scope.jsonFacturacion.telefonos  = $scope.destinatario[i].contacto.telefonos;
                                                    $scope.jsonFacturacion.email  = $scope.destinatario[i].contacto.email;        

                                            }else{
                                                $scope.cargaCiudadEnvio(1,0);
                                              /*var confirm = $mdDialog.confirm()
                                                    .title('Informacion')
                                                    .textContent('Desea reemplazar los datos de contacto.')
                                                    .ariaLabel('Mensaje')
                                                    .targetEvent()
                                                    .ok('ok')
                                                    .cancel('Cancelar');
                                              $mdDialog.show(confirm).then(function() {
                                                $scope.cargaCiudadEnvio(1,0);
                                                       
                                              }, function() {
                                                
                                                console.log("no hace nada");
                                              });*/
                                          }                                         
                            }                                      
                  };
        }        
        
        $scope.cargaCiudadEnvio = function(val, id){                
          if(parseInt(id) != 0 )
          {          
            $scope.jsonFacturacion.destinatario = val ; 
          }
          
          console.log('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/'+contexto+'/ordenes/ciudades-x-destinatario_remitente?id_destinatario_remitente='+$scope.jsonFacturacion.destinatario+'&id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio )
          $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/'+contexto+'/ordenes/ciudades-x-destinatario_remitente?id_destinatario_remitente='+$scope.jsonFacturacion.destinatario+'&id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio )             
              .error(function(data, status, headers, config){
                console.log("error ===>");
                console.log(status);
                console.log(data);
                console.log(headers);
                console.log(config);            
              })
              .then(function(response){               
                $rootScope.ciudad= response.data;
               //console.log("json cargado ciudad ===> "+$scope.destinatario[0].id   + "----" +  $scope.jsonFacturacion.destinatario );
                console.log($scope.ciudad) ; 
                $scope.jsonFacturacion.nombre  = $scope.jsonFacturacion.nombre ;
                $scope.jsonFacturacion.telefonos  = $scope.jsonFacturacion.telefonos;
                $scope.jsonFacturacion.email  = $scope.jsonFacturacion.email;
          
                if(val === 0 ){
                  for (var i = 0; i < $scope.destinatario.length; i++) {                              
                     if(parseInt($scope.destinatario[i].id) === parseInt($scope.jsonFacturacion.destinatario)){
                      //if(angular.equals($scope.destinatario[i].id, $scope.jsonFacturacion.destinatario)){
                     // console.log("entra" +  $scope.destinatario.numeroIdentificacion );
                        //$scope.jsonFacturacion.numeroDocumento =  $scope.destinatario[i].numeroIdentificacion;                        
                                $scope.jsonFacturacion.nombre  = $scope.destinatario[i].contacto.nombres ;
                                $scope.jsonFacturacion.telefonos  = $scope.destinatario[i].contacto.telefonos;
                                $scope.jsonFacturacion.email  = $scope.destinatario[i].contacto.email;        
                     }                  
                 }
              }else{

                   for (var i = 0; i < $scope.destinatario.length; i++) {                            
                                         if(parseInt($scope.destinatario[i].id) === parseInt($scope.jsonFacturacion.destinatario)){
                                          //if(angular.equals($scope.destinatario[i].id, $scope.jsonFacturacion.destinatario)){
                                         // console.log("entra" +  $scope.destinatario.numeroIdentificacion );
                                            //$scope.jsonFacturacion.numeroDocumento =  $scope.destinatario[i].numeroIdentificacion;
                                            $rootScope.nombreDest = $scope.destinatario[i].contacto.nombres;
                                            $rootScope.telefonoDest = $scope.destinatario[i].contacto.telefonos;
                                            $rootScope.emailDest = $scope.destinatario[i].contacto.email;
                                            if(  $scope.jsonFacturacion.nombre === "" &&   $scope.jsonFacturacion.telefonos === "" &&  $scope.jsonFacturacion.email  === "" ){
                                                    $scope.jsonFacturacion.nombre  = $scope.destinatario[i].contacto.nombres ;
                                                    $scope.jsonFacturacion.telefonos  = $scope.destinatario[i].contacto.telefonos;
                                                    $scope.jsonFacturacion.email  = $scope.destinatario[i].contacto.email;        

                                            }else{
                                                $scope.jsonFacturacion.nombre  = $rootScope.nombreDest;
                                                    $scope.jsonFacturacion.telefonos  =$rootScope.telefonoDest ;
                                                    $scope.jsonFacturacion.email  =$rootScope.emailDest ;  
                                            /*  var confirm = $mdDialog.confirm()
                                                    .title('Informacion')
                                                    .textContent('Desea reemplazar los datos de contacto.')
                                                    .ariaLabel('Mensaje')
                                                    .targetEvent()
                                                    .ok('ok')
                                                    .cancel('Cancelar');
                                              $mdDialog.show(confirm).then(function() {
                                                      $scope.jsonFacturacion.nombre  = $rootScope.nombreDest;
                                                    $scope.jsonFacturacion.telefonos  =$rootScope.telefonoDest ;
                                                    $scope.jsonFacturacion.email  =$rootScope.emailDest ;        
                                                       
                                              }, function() {
                                                
                                                console.log("no hace nada");
                                              });*/
                                          }                                      
                            }                                    
                      };
              }
                /*for (var i = 0; i < $scope.destinatario.length; i++) {                              
                     if(parseInt($scope.destinatario[i].id) === parseInt($scope.jsonFacturacion.destinatario)){
                      //if(angular.equals($scope.destinatario[i].id, $scope.jsonFacturacion.destinatario)){
                     // console.log("entra" +  $scope.destinatario.numeroIdentificacion );
                        //$scope.jsonFacturacion.numeroDocumento =  $scope.destinatario[i].numeroIdentificacion;                        
                                $scope.jsonFacturacion.nombre  = $scope.destinatario[i].contacto.nombres ;
                                $scope.jsonFacturacion.telefonos  = $scope.destinatario[i].contacto.telefonos;
                                $scope.jsonFacturacion.email  = $scope.destinatario[i].contacto.email;        

                     }
                  
                 };*/              

          });    
        }   


        $scope.mostrarMensajeFechaNoConfirmada = function (){

            var confirm = $mdDialog.confirm().title('Información')
                                             .textContent('Recuerde que si usted no indica la fecha de la cita, su pedido no sera procesado hasta que sea confirmada.')
                                             .ariaLabel('Mensaje')
                                             .targetEvent()
                                             .ok('ok')
                                             .cancel('Cancelar');
                                              $mdDialog.show(confirm).then(function() {
                                                console.log("no hace");                                                      
                                              }, function() {                                                
                                                console.log("no hace nada");
                                              });
        }  
        /*******************************Combo destino  *********************************************/   
        $rootScope.destino = [];
        $scope.cargaDestinosEnvio = function (){
            console.log("entra cargar destinos envio ");
            console.log("")
            $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/'+contexto+'/ordenes/destinos_origenes-x-destinatario_remitente-x-ciudad?id_destinatario_remitente='+$scope.jsonFacturacion.destinatario+'&id_ciudad='+$scope.jsonEnvio.ciudad+'&id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio)              
              .error(function(data, status, headers, config){
                  console.log("error ===>");
                  console.log(status);
                  console.log(data);
                  console.log(headers);
                  console.log(config);
            
              })
              .then(function(response){               
                 $rootScope.destino= response.data;
                 console.log("json cargado destino ===> " );
                 console.log($rootScope.destino);
                 //console.log(angular.toJson($rootScope.destino, true)) ; 
            });    
        }

        /***********hace set del valor de bodega *******************/
        $scope.asignoDestinatario=function(){
            $scope.dis.tabEntrega = false ; 
        }
        
        /******************************Cargar informacion destino envio***************/
        $scope.cargaInfoDestinoEnvio = function (id){
          console.log("evento carga info destino"); 
          console.log($scope.destino);
          for (var i = 0; i < $scope.destino.length; i++) {          
            if(parseInt($scope.jsonEnvio.destino) === $scope.destino[i].id ){             
                       $rootScope.nombreShipDest =   $scope.destino[i].contacto.nombres;
                       $rootScope.direccionShipDest =   $scope.destino[i].direccion.direccion;
                       $rootScope.indicacionesShipDest =    $scope.destino[i].direccion.indicacionesDireccion;
                       $rootScope.telefonoShipDest =   $scope.destino[i].contacto.telefonos ;
                       $rootScope.emailShipDest =  $scope.destino[i].contacto.email;
                      if(  $scope.jsonEnvio.nombre === "" &&   
                           $scope.jsonEnvio.telefonos === "" &&  
                           $scope.jsonEnvio.email  === "" 
                          ){
                                 $scope.jsonEnvio.direccion = $scope.destino[i].direccion.direccion;
                                 $scope.jsonEnvio.nombre = $scope.destino[i].contacto.nombres;
                                 $scope.jsonEnvio.indicacionesDireccion = $scope.destino[i].direccion.indicacionesDireccion ;
                                 $scope.jsonEnvio.telefonos =  $scope.destino[i].contacto.telefonos ;
                                 $scope.jsonEnvio.email = $scope.destino[i].contacto.email ;

                      }else{
                      /*  var confirm = $mdDialog.confirm()
                              .title('Informacion')
                              .textContent('Desea reemplazar los datos de contacto.')
                              .ariaLabel('Mensaje')
                              .targetEvent()
                              .ok('ok')
                              .cancel('Cancelar');
                        $mdDialog.show(confirm).then(function() {*/
                                //$scope.jsonEnvio.direccion =  $rootScope.direccionShipDest;
                                 $scope.jsonEnvio.nombre =   $rootScope.nombreShipDest;
                                 //$scope.jsonEnvio.indicacionesDireccion =  $rootScope.indicacionesShipDest ;
                                 $scope.jsonEnvio.telefonos =  $rootScope.telefonoShipDest ;
                                 $scope.jsonEnvio.email =   $rootScope.emailShipDest;     
                                 
                      /*  }, function() {
                          
                          console.log("no hace nada");
                        });*/
                    }
               }              
            }
          $scope.dis.tabEntrega = false ;        
	       }


   /*******************************Combo productos  por  cliente  *********************************************/
        $rootScope.productosCliente = [];
        $rootScope.dataCombo = [];
        $rootScope.cargarProductosCliente = function (cliente,tipoServicio){            
            $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/'+contexto+'/ordenes/productos-x-cliente?id_cliente='+cliente+'&id_tipo_servicio='+tipoServicio)
              
              .error(function(data, status, headers, config){
                  console.log("error ===>");
                  console.log(status);
                  console.log(data);
                  console.log(headers);
                  console.log(config);
            
              })
              .then(function(response){
               
                  $rootScope.productosCliente= response.data;
                  
                  console.log("json cargado productos ===> " );
                  console.log($rootScope.productosCliente);
              
                  for (var i =0; i < $rootScope.productosCliente.length; i++) {
                     $rootScope.dataCombo= $rootScope.dataCombo.concat(
                                                                {
                                                                  id:      $rootScope.productosCliente[i].id  , 
                                                                  value :   $rootScope.productosCliente[i].nombreLargo + " | " +$rootScope.productosCliente[i].codigo +" @" +  $rootScope.productosCliente[i].id                                                                
                                                                }
                                                              );
                  }
                  
                  $scope.gridOptions.columnDefs[1].editDropdownIdLabel  = 'value';
                  $scope.gridOptions.columnDefs[1].editDropdownOptionsArray =   $rootScope.dataCombo;
            });    
    }
      /*******************************Combo jornada  *********************************************/
      /*$scope.jornadaEntrega= [
                   {"id":"1", "texto":"Am"},
                   {"id":"2", "texto":"Pm"},
                   {"id":"3", "texto":"Am/Pm"}                
        ];*/
        $scope.configuracionData = [];
        $scope.cargarConfiguracion = function (cliente,tipoServicio){              
            $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/'+contexto+'/ordenes/configuracion_orden-x-tipo_servicio?id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio+'&id_cliente='+$scope.jsonFacturacion.cliente)             
              .error(function(data, status, headers, config){
                console.log("error ===>");
                console.log(status);
                console.log(data);
                console.log(headers);
                console.log(config);
            
              })
              .then(function(response){               
                $scope.configuracionData= response.data;
                console.log("json cargado configuracion ===> " );
                console.log('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/'+contexto+'/ordenes/configuracion_orden-x-tipo_servicio?id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio+'&id_cliente='+$scope.jsonFacturacion.cliente);
                console.log($scope.configuracionData) ;                 
                $scope.jornadaEntrega = $scope.configuracionData[0].jornadas;
                $scope.requerimientosDocumentales =  $scope.configuracionData[1].requerimientosDocumentales ; 
                console.log($scope.configuracionData[0].jornadas);                
                console.log($scope.configuracionData[1].requerimientosDocumentales);
                $scope.ubicarEnTab();
          });    

        }

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
           //   $scope.jsonEnvio.valorBodegaShipTo  = val ;
             $scope.jsonEnvio.valorBodegaShipTo   = $scope.jsonEnvio.ciudad ; 
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
                         $scope.ubicarEnTab(); 

                    });    
                
            }
         
          /**************************Carga formas de pago*************************************************/
            $scope.cargaFormasDePago = function (){
             console.log('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/ordenes/tipos_forma_pago-x-cliente-x-tipo_servicio?id_cliente='+$scope.jsonFacturacion.cliente+'&id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio);
             $http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/ordenes/tipos_forma_pago-x-cliente-x-tipo_servicio?id_cliente='+$scope.jsonFacturacion.cliente+'&id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio)
                    

                    .error(function(data, status, headers, config){
                         console.log("error ===>");
                         console.log(status);
                         console.log(data);
                         console.log(headers);
                         console.log(config);
                  
                    })
                    .then(function(response){
                     
                        $scope.formasPago= response.data;                   
                        console.log("respuesta formas de pago ==>");
                        console.log($scope.formasPago) ; 

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

         $scope.cargaHoras2 = function (){
             for (var i =  0; i < $scope.jornadaEntrega.length; i++) {
                if($scope.jsonEntrega.jornada2 ===$scope.jornadaEntrega[i].codigo )
                {
                    console.log("Entra");
                    $scope.jsonEntrega.horaMinima2 = $scope.jornadaEntrega[i].horaMinima;
                    $scope.jsonEntrega.horaMaxima2 = $scope.jornadaEntrega[i].horaMaxima
                }
             };
         }

        $scope.estadoEntrega= [
                   {"id":"1", "texto":"En elaboración"}
                 
        ];

         $scope.opcionEntrega= [
                   {"id":"1", "texto":"Corte mas proximo"}
                 
        ];
         
      var test = 10  ;
      var producto  = "";
      var bodega = "";
      var cantidad = "" ; 
      var unidad = "";
      var lote ="";
      var notas ="";
      $scope.productosTemporales = [];
      $scope.imprimir = function (){
      $scope.productosTemporales=  $scope.productosTemporales.concat([
                                  {
                                     "producto":producto, 
                                     "bodega":bodega,
                                     "cantidad" : cantidad  ,
                                     "unidad"  : unidad , 
                                     "lote":lote,
                                     "notas" :notas
                                  }
                              ]);
     
      //console.log(angular.toJson($scope.productosTemporales, true));
            }
     /*********************eliminar linea ******************************/
      $scope.eliminarLinea= function ()
      {

        console.log("Entra a eliminar" + idLineaOrden);
        console.log('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/'+contexto+'/ordenes/'+$scope.ordenSeleccionada.idOrden+'/deleteLineaOrden/'+idLineaOrden+'/'+$scope.login.usuario);
        $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/'+contexto+'/ordenes/'+$scope.ordenSeleccionada.idOrden+'/deleteLineaOrden/'+idLineaOrden+'/'+$scope.login.usuario)
             
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
                  
                 // alert("aqui " + valorTotalLineas + " - "  +  cantidadResta ) ;
                  var totalresta   = cantidadResta * numeroResta ; 
                  //alert("aqui " + cantidadResta + " * "  +  numeroResta + "= " +  totalresta ) ;
                  $scope.valorTotalLineas = parseInt(valorTotalLineas)  -  parseInt(totalresta); 
                  valorTotalLineas = parseInt(valorTotalLineas)  -  parseInt(totalresta); 
                  $scope.valorTotalLineasTexto = $scope.obtenerValorMascara(valorTotalLineas) ;

                  $rootScope.contarProductosPorUnidad($scope.respuestaEliminacion.orden.lineas);                  
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
                
              //  $scope.onProductoAdd.unidad = "";
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
          //templateUrl: './ordenesVenta/agregarProducto.tmpl.html',
            templateUrl: './ordenesVenta/agregarProductoSt.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:false,
            fullscreen: useFullScreen,
            locals: { serverData: $scope.serverData ,
                       jsonFacturacion :$scope.jsonFacturacion , 
                       productosTemporales :$scope.productosTemporales , 
                       imprimir  : $scope.imprimir ,   
                       tabla :$scope.datatable ,
                       jsonEntregaRetorno :  $scope.jsonEntregaRetorno,
                       login :$scope.login,
                       ordenSeleccionada :$scope.ordenSeleccionada,
                       gridOptions : $scope.gridOptions,
                       esEdicion:$scope.esEdicion,
                       cantidadTotal:$scope.cantidadTotal,
                       tipoUbicacionLineaOrden: $scope.tipoUbicacionLineaOrden , 
                       ciudad : $scope.ciudad 
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


     $scope.cerrarAdvanced = function(){
      console.log("entra");
      $mdDialog.hide()

     }

     
      function DialogController($scope, $mdDialog ,serverData,jsonFacturacion,productosTemporales,imprimir,tabla ,jsonEntregaRetorno , login,ordenSeleccionada ,gridOptions ,esEdicion,cantidadTotal , tipoUbicacionLineaOrden, ciudad  ) {              
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
              $scope.ordenSeleccionada = ordenSeleccionada ;
              $scope.gridOptions = gridOptions ; 
              $scope.esEdicion = esEdicion ; 
              $scope.cantidadTotal = cantidadTotal;
              $scope.tipoUbicacionLineaOrden =  tipoUbicacionLineaOrden ;
              $scope.ciudad = ciudad  ; 
              $scope.prodCli  ={};             
              $scope.lineasProductoAlternos = false ; 
              $scope.lineasBodegaAlternos = false ; 
              $scope.lineasCiudadAlternos = false ; 
              $scope.lineasUnidadAlternos = false ; 
              if($scope.esEdicion === 0 )
              { 
                    console.log("Agregar un producto  nuevo");
                    $scope.jsonProductoAdd.producto = "";
                    $scope.jsonProductoAdd.bodega ="" ;
                    $scope.jsonProductoAdd.cantidad = "";
                    $scope.jsonProductoAdd.unidad = "";
                    $scope.jsonProductoAdd.lote ="";
                    $scope.jsonProductoAdd.notas  ="";
                    $scope.jsonProductoAdd.alto = "";
                    $scope.jsonProductoAdd.largo = "";
                    $scope.jsonProductoAdd.ancho = "";
                    $scope.jsonProductoAdd.volumen = "";
                    $scope.jsonProductoAdd.total = "";
                    $scope.jsonProductoAdd.pesoBruto  ="";
                    $scope.jsonProductoAdd.totalKilos = "";
                    $scope.jsonProductoAdd.pesoVolumetrico = "";
                    $scope.jsonProductoAdd.totalVolumen = "";
                    $scope.jsonProductoAdd.valorDeclarado ="";
                    $scope.jsonProductoAdd.totalDeclarado = "";
              
              }else{
                    $scope.lineasProductoAlternos = false ; 
                    $scope.lineasBodegaAlternos = false ; 
                    $scope.lineasCiudadAlternos = false ; 
                    $scope.lineasUnidadAlternos = false ; 

                    if(ciudadNombreAlterno != null  ||  ciudadNombreAlterno != ''){
                        $scope.lineasCiudadAlternos = false ; 
                    }else{
                        $scope.lineasCiudadAlternos = true ; 
                    }

                    if(codigoBodegaAlterno != null || codigoBodegaAlterno != '' || 
                      nombreBodegaAlterno != null || nombreBodegaAlterno != '' ){
                        $scope.lineasBodegaAlternos = false ;
                    }else{
                        $scope.lineasBodegaAlternos = true ;
                    }

                    if(codigoProductoAlterno != null || codigoProductoAlterno != '' ||
                      nombreProductoAlterno != null || nombreProductoAlterno != ''){
                        $scope.lineasProductoAlternos = false ; 
                    }else{
                        $scope.lineasProductoAlternos = true; 
                    }

                    if(codigoUnidadAlterno != null || codigoUnidadAlterno != ''){
                      $scope.lineasUnidadAlternos = false ; 
                    }else{
                      $scope.lineasUnidadAlternos = true ; 
                    }

                    $scope.idLineaOrden  =  idLineaOrden  ; 
                    $scope.jsonProductoAdd.producto = producto;
                    $scope.jsonProductoAdd.bodega =bodega ;
                    $scope.jsonProductoAdd.cantidad = cantidad;
                    $scope.jsonProductoAdd.unidad = idUnidadMedidaEdicion;
                    $scope.jsonProductoAdd.lote =lote;
                    $scope.jsonProductoAdd.notas  =notas;
                    $scope.jsonProductoAdd.alto = alto;
                    $scope.jsonProductoAdd.largo = largo;
                    $scope.jsonProductoAdd.ancho = ancho;                    
                    $scope.jsonProductoAdd.pesoBruto  =pesoBruto;                    
                    $scope.jsonProductoAdd.valorDeclarado =valorDeclarado;
                    $scope.prodCli.selectedItem ={}                    
                    $scope.prodCli.selectedItem.nombre  = producto +","+ nombreProducto;
                    $scope.prodCli.selectedItem.id = idProductoEdit;
                    console.log('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/ordenes/ciudades-x-producto?id_producto='+$scope.prodCli.selectedItem.id)
                    $http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/ordenes/ciudades-x-producto?id_producto='+$scope.prodCli.selectedItem.id)
                       
                        .error(function(data, status, headers, config){
                            console.log("error ===>");
                            console.log(status);
                            console.log(data);
                            console.log(headers);
                            console.log(config);
                      
                        })
                        .then(function(response){
                         
                         $scope.ciudadesProducto= response.data;
                         console.log("Ciudades para crear productos ");
                         console.log($scope.ciudadesProducto) ; 

                    });   
                    $http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/ordenes/unidades-x-producto?id_producto='+$scope.prodCli.selectedItem.id)
                            
                            .error(function(data, status, headers, config){
                                 console.log("error ===>");
                                  console.log(status);
                                  console.log(data);
                                  console.log(headers);
                                  console.log(config);
                          
                            })
                            .then(function(response){
                             
                             $scope.unidadesProducto= response.data;
                            console.log("json cargado unidades producto ===> " );                            
                             console.log($scope.unidadesProducto) ; 

                    });        


                    console.log("Editar un producto existente ==>"  + $scope.idLineaOrden);


              }
              $scope.muestraAgrega =  false;
              $scope.showNuevoProducto = function(){
                    if($scope.muestraAgrega){
                      $scope.muestraAgrega =  false;

                    }else{
                      $scope.muestraAgrega =  true;
                    }                   
              }

              $http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/ordenes/productos-x-cliente?id_cliente='+ $scope.jsonFacturacion.cliente+'&id_tipo_servicio='+ $scope.jsonFacturacion.tipoServicio)
                
                .error(function(data, status, headers, config){
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

              /**************************Carga unidades por producto*************************************************/
              $scope.cargaUnidades = function (){
               console.log('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/ordenes/unidades-x-producto?id_producto='+$scope.jsonProductoAdd.producto); 
               $http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/ordenes/unidades-x-producto?id_producto='+$scope.jsonProductoAdd.producto)
                   
                    .error(function(data, status, headers, config){
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


            /**************************Carga bodegas a partir de un producto*************************************************/
            $scope.cargaBodegas = function (){
              console.log("carga bodegas");
              console.log('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/ordenes/bodegas-x-producto-x-ciudad?id_producto='+$scope.jsonProductoAdd.producto+'&id_ciudad='+$scope.jsonProductoAdd.ciudad)
              $http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/ordenes/bodegas-x-producto-x-ciudad?id_producto='+$scope.jsonProductoAdd.producto+'&id_ciudad='+$scope.jsonProductoAdd.ciudad)
                    
                    .error(function(data, status, headers, config){
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
                    console.log('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/ordenes/bodegas-x-producto?id_producto='+$scope.jsonProductoAdd.producto+'&id_ciudad='+$scope.jsonProductoAdd.ciudad);
                      console.log("carga bodegas producto =>");
                     console.log($scope.bodegasProducto) ; 

                });    
                 $scope.cargaUnidades();   
            }
            /*******************Carga  datos de la  bodega **************************************/
            $scope.cargaDatosBodega  = function (){
                for (var i = 0; i < $scope.bodegasProducto.length; i++) {
                     if(parseInt($scope.bodegasProducto[i].id)  === parseInt($scope.jsonProductoAdd.bodega)){

                        $scope.jsonProductoAdd.codigoBodegaAlterno = $scope.bodegasProducto[i].codigo;
                        $scope.jsonProductoAdd.nombreBodegaAlterno = $scope.bodegasProducto[i].nombre;
                     }
                }

            }

             /**************************Carga bodegas a partir de un producto*************************************************/
            $scope.mostrarCantidadDisponible  = 0 ;
            $scope.cargaCiudadesProducto = function (val){
              console.log("prodCli");
              console.log($scope.prodCli.selectedItem);
              $scope.jsonProductoAdd.producto = val;
              for (var i = 0; i <  $scope.productosCliente.length; i++) {

                 if(parseInt($scope.jsonProductoAdd.producto) === parseInt($scope.productosCliente[i].id) ){
                        console.log("nombre => "+$scope.productosCliente[i].nombre);
                        console.log("nombre largo  => "+$scope.productosCliente[i].nombreLargo);
                        $scope.jsonProductoAdd.codigoProducto = $scope.productosCliente[i].codigo;
                        $scope.jsonProductoAdd.nombreProducto = $scope.productosCliente[i].nombre;
                        $scope.jsonProductoAdd.codigoProductoAlterno = $scope.productosCliente[i].codigoAlterno;
                        $scope.jsonProductoAdd.nonbreProductoAlterno = $scope.productosCliente[i].nombreLargo;

                 }
              }
             console.log('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/ordenes/ciudades-x-producto?id_producto='+$scope.jsonProductoAdd.producto)
             $http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/ordenes/ciudades-x-producto?id_producto='+$scope.jsonProductoAdd.producto)                    
                    .error(function(data, status, headers, config){
                        console.log("error ===>");
                        console.log(status);
                        console.log(data);
                        console.log(headers);
                        console.log(config);
                  
                    })
                    .then(function(response){
                     
                     $scope.ciudadesProducto= response.data;
                     console.log("Ciudades para crear productos ");
                     console.log($scope.ciudadesProducto) ; 
                      

                });    
                 $scope.cargaUnidades();   
            }
              /**************************Carga  unidad cliente apartir de unidad*************************************************/
        
            $scope.mostrarMedidasProducto = 0;
            $scope.cantidadDisponible = "n/a";
            $scope.cargaUnidadesCliente = function (valor){

              console.log("entra cargue cliente unidadad  =="  +valor );
                  for (var i = 0 ; i < $scope.unidadesProducto.length; i++) {
                      if(parseInt($scope.unidadesProducto[i].id) === parseInt($scope.jsonProductoAdd.unidad)){
                          $scope.jsonProductoAdd.unidadCliente = $scope.unidadesProducto[i].nombreAlterno ; 
                          $scope.jsonProductoAdd.alto  = $scope.unidadesProducto[i].alto ; 
                          $scope.jsonProductoAdd.largo = $scope.unidadesProducto[i].largo; 
                          $scope.jsonProductoAdd.ancho  = $scope.unidadesProducto[i].ancho ; 
                          $scope.jsonProductoAdd.volumen =  $scope.jsonProductoAdd.alto * $scope.jsonProductoAdd.ancho * $scope.jsonProductoAdd.largo;
                          $scope.jsonProductoAdd.total =  $scope.jsonProductoAdd.volumen *  $scope.jsonProductoAdd.cantidad;
                          $scope.jsonProductoAdd.pesoBruto =  $scope.unidadesProducto[i].pesoBruto;
                          $scope.jsonProductoAdd.pesoVolumetrico  =   $scope.jsonProductoAdd.pesoBruto  *  $scope.jsonProductoAdd.volumen;
                          $scope.jsonProductoAdd.totalKilos=  $scope.jsonProductoAdd.pesoBruto *  $scope.jsonProductoAdd.cantidad;
                          $scope.jsonProductoAdd.totalVolumen  = $scope.jsonProductoAdd.pesoVolumetrico *  $scope.jsonProductoAdd.cantidad;
                          $scope.jsonProductoAdd.totalDeclarado =  $scope.jsonProductoAdd.totalVolumen + $scope.jsonProductoAdd.totalKilos + $scope.jsonProductoAdd.total ;
                          $scope.mostrarMedidasProducto = 1;
                          $scope.mostrarCantidadDisponible  = 1 ;


                            $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/serviciosTactic/consultaDisponibles')
                                  
                                  .error(function(data, status, headers, config){
                                    console.log("error ===>");
                                    console.log(status);
                                    console.log(data);
                                    console.log(headers);
                                    console.log(config);                                
                                  })
                                  .then(function(response){
                                   
                                   $scope.respuestaDisponible =response.data; 
                                   $scope.cantidadDisponible = $scope.respuestaDisponible.cantidad ;
                                   console.log("canitdad disponibles"); 
                                   console.log($scope.cantidadDisponible);
                              });    

                      }
                  }      
            }

        $scope.destino = [];
        $scope.cargaDestinosEnvio = function (){
            console.log("entra cargar destinos envio ");
            console.log("")
            $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/'+contexto+'/ordenes/destinos_origenes-x-destinatario_remitente-x-ciudad?id_destinatario_remitente='+$scope.jsonFacturacion.destinatario+'&id_ciudad='+$scope.jsonProductoAdd.ciudad+'&id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio)             
              .error(function(data, status, headers, config){
                console.log("error ===>");
                console.log(status);
                console.log(data);
                console.log(headers);
                console.log(config);            
              })
              .then(function(response){               
               $rootScope.destino= response.data;
               console.log("json cargado destino ===> " );
               console.log($scope.destino) ; 

           });    
        }           
        $scope.cerrarModal = function (){
            $mdDialog.hide();
        }
        $scope.campoValidacionNuevaLinea = "";
        $scope.faltanDatosNuevaLinea = false ;
        $scope.validarDataNuevaLinea = function (){
          
          if($scope.jsonProductoAdd.cantidad === null  || $scope.jsonProductoAdd.cantidad === ""  ){
              $scope.campoValidacionNuevaLinea = "Cantidad";
              $scope.faltanDatosNuevaLinea = true;
              return;
          }else if ($scope.jsonProductoAdd.unidad === null ||  $scope.jsonProductoAdd.unidad === ""){
              $scope.campoValidacionNuevaLinea = "Unidad";
              $scope.faltanDatosNuevaLinea = true;
              return;

          }else{
            $scope.agregarProductoTemporal();
          }
        }
          
      $scope.agregarProductoTemporal = function (){

              //var dataPreview = document.getElementById('productoLista');
              //$scope.lista.nombre = dataPreview.getAttribute("data-nombre");


              //console.log("valor = " + $attrs.nombre);
                       /* datatableData =  datatableData.concat([
                                                    {
                                                      "producto":$scope.lista.nombre, 
                                                      "bodega":54456744 ,
                                                       "cantidad" : 10  ,
                                                       "unidad"  : "Bu" , 
                                                       "lote":"123423",
                                                       "notas" :"texto"
                                                    }
                                                ]);*/

                                //Init the datatable with his configuration
        //$scope.datatable = datatable(datatableConfig);
        //Set the data to the datatable
        //$scope.datatable.setData(datatableData);
           console.log("data entrega en modal ");
           console.log($scope.jsonEntregaRetorno);

           $scope.jsonEntregaProducto=  [{
                                             idLineaOrden:$scope.idLineaOrden,
                                             idOrden :parseInt($scope.ordenSeleccionada.idOrden),
                                             numeroItem : 10,
                                             producto : $scope.jsonProductoAdd.producto , 
                                             codigoProducto :parseInt($scope.jsonProductoAdd.codigoProducto) ,
                                             nombreProducto : $scope.jsonProductoAdd.nombreProducto , 
                                             codigoProductoAlterno : $scope.jsonProductoAdd.codigoProductoAlterno , 
                                             nombreProductoAlterno : $scope.jsonProductoAdd.nombreProductoAlterno, 
                                             cantidad :parseInt($scope.jsonProductoAdd.cantidad),
                                             unidad : parseInt($scope.jsonProductoAdd.unidad),
                                             codigoUnidad : $scope.jsonProductoAdd.codigoUnidad ,
                                             nombreUnidad: $scope.jsonProductoAdd.codigoUnidadAlterno,
                                             codigoUnidadAlterno : $scope.jsonProductoAdd.codigoUnidadAlterno,
                                             bodega :parseInt($scope.jsonProductoAdd.bodega),
                                             codigoBodega: $scope.jsonProductoAdd.bodega ,
                                             nombreBodega : $scope.jsonProductoAdd.bodega , 
                                             codigoBodegaAlterno :$scope.jsonProductoAdd.codigoBodegaAlterno ,
                                             nombreBodegaAlterno : $scope.jsonProductoAdd.nombreBodegaAlterno, 
                                             lote :$scope.jsonProductoAdd.lote,
                                             notas :"notas",
                                             idUsuario:parseInt($scope.login.id),
                                             usuario:$scope.login.usuario ,
                                             valorDeclaradoPorUnidad : $scope.jsonProductoAdd.valorDeclarado
                                        }];
        console.log("jsonEntregaProducto  data  =>");
        console.log(angular.toJson($scope.jsonEntregaProducto, true));
        console.log('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/ordenes/saveLineaOrden' , $scope.jsonEntregaProducto)

        $http.post('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/ordenes/saveLineaOrden' , $scope.jsonEntregaProducto)
              
              .error(function(data, status, headers, config){
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
                if ($scope.jsonProductoRetorno.mensajes.severidadMaxima != 'INFO') {
                  alert("error" + $scope.jsonProductoRetorno.mensajes.mensajes[0].texto )

                 }else{
                       //$scope.imprimir();
                       console.log("json cargado retorno  productos ===> ");
                       console.log($scope.jsonProductoRetorno.orden.lineas);

                        for (var i = 0; i < $scope.jsonProductoRetorno.orden.lineas.length; i++) {
                  
                               if($scope.jsonProductoRetorno.orden.lineas[i].valorDeclaradoPorUnidad  !=  null){
                                  $rootScope.mostrarValorDeclarado = false;
                               }

                            }
                            if($rootScope.mostrarValorDeclarado){
                              console.log("NO hay valor declarado en ninguna linea");
                            }else{
                              console.log("Ya existe un valor declarado en la linea");
                            }


                       $rootScope.contarProductosPorUnidad($scope.jsonProductoRetorno.orden.lineas);
                       

                       for (var i = 0; i < $scope.jsonProductoRetorno.orden.lineas.length ; i++) {
                          $scope.cantidadTotal += $scope.jsonProductoRetorno.orden.lineas[i].cantidad ; 
                       }
                       console.log("cantidad total  = " + $scope.cantidadTotal);

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
             // $scope.idLineaOrden =  $scope.jsonProductoRetorno.lineaOrden.idlineaOrden;
               //console.log("json cargado retorno  productos ===> "  +  $scope.idLineaOrden  );
              //$scope.gridOptions.data = [] ;
              //$scope.gridOptions.data = $scope.jsonProductoRetorno.orden.lineas ;
                //$scope.dataTabs.tabEnvio = false;
               //$scope.dataTabs.tabSeleccionada =1; 

             });                           
       }
  }

      $scope.mostrarMensajeEdicionExitosa  = function(ev) {                
              $mdDialog.show(
                  $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('informacion')
                    .textContent('Se ha guardado la orden correctamente')
                    .ariaLabel('Mensaje')
                    .ok('OK')                     
                    .targetEvent(ev)
                    
               ).finally(function() {
                    $scope.bloquearBotonGuardar =  false ; 
                    console.log("Lineas en mensajes ");
                    console.log($scope.edicionRetorno.orden.lineas);
                    //$scope.gridOptions.data = [];
                    //$scope.gridOptions.data = $scope.edicionRetorno.orden.lineas;
                    //$scope.gridOptions.columnDefs = $scope.columnDefs;                     
                    $scope.gridOptions.data.length = 0;
                    //$scope.gridOptions.data.concat($scope.edicionRetorno.orden.lineas);
                    $scope.gridOptions.data =$scope.edicionRetorno.orden.lineas;
                    $scope.gridApi.core.refresh();
              });
      };

      $scope.jsonEdicion = [];
      
      $scope.finalizarEdicion = function(){
        $scope.bloquearBotonGuardar =  true ; 
          console.log("valor " +  parseInt($scope.data.info) ) ; 
          if(parseInt($scope.data.info) === 0 ){
                $scope.jsonEntrega.fechaMaxima =   $scope.jsonEntrega.fechaMaxima;
                $scope.jsonEntrega.fechaMinima =  $scope.jsonEntrega.fechaMaxima;
          }
          if(parseInt($scope.data.info) === 1 ){
                $scope.jsonEntrega.fechaMaxima =   $scope.jsonEntrega.fechaMaxima;
                $scope.jsonEntrega.fechaMinima =  $scope.jsonEntrega.fechaMinima;
          }
          if(parseInt($scope.data.info) === 3 ){
                $scope.jsonEntrega.fechaMaxima =  null;
                $scope.jsonEntrega.fechaMinima =  null;
          }

          $scope.jsonEdicion = { 
                                  idOrden: parseInt($scope.ordenSeleccionada.idOrden),
                                  datosFacturacion :$scope.jsonFacturacion,
                                  destinoOrigen : $scope.jsonEnvio,
                                  destinoOrigenBodega : $scope.jsonEnvioShipTo,
                                  datosEntregaRecogida  :$scope.jsonEntrega,
                                  datosOtros: $scope.jsonOtros,
                                  lineas : $scope.lineas ,
                                  usuarioActualizacion:$scope.login.usuario,
                                  idUsuarioActualizacion : parseInt($scope.login.id),
                                  nuevoEstadoOrden :$scope.jsonFacturacion.estadoOrdenType
                                 };
          
          console.log("lineas");
          console.log( $scope.lineas );
          console.log("Json envio edicion");
          console.log(angular.toJson($scope.jsonEdicion, true));

          
           $http.post('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/ordenes/save',$scope.jsonEdicion)
                  
                    .error(function(data, status, headers, config){
                         console.log("error ===>");
                          console.log(status);
                          console.log(data);
                          console.log(headers);
                          console.log(config);                  
                    })
                    .then(function(response){
                     
                     $scope.edicionRetorno= response.data;
                     $scope.jsonEnvio= response.data;
                    console.log("json edicion retorno ===> " );
                    console.log(angular.toJson($scope.edicionRetorno, true));
                     if ($scope.edicionRetorno.mensajes.severidadMaxima != 'INFO') {
                      alert("error" + $scope.edicionRetorno.mensajes.mensajes[0].texto )

                      }else{
                          
                          $scope.mostrarMensajeEdicionExitosa();                      
                      }
                });    
      }

    $scope.jsonAceptacion = [];
    $scope.finalizarAceptacion = function(){
        if($scope.jsonFacturacion.numeroDocumentoOrdenCliente === undefined || 
          $scope.jsonFacturacion.numeroDocumentoOrdenCliente === null    ||
          $scope.jsonFacturacion.numeroDocumentoOrdenCliente === ""){
          console.log("falta numero de documento");
          alert("Se debe agregar numero de documento que acompaña la orden !!!");

        }else{
          console.log("ya tiene numero de documento");
          $scope.jsonAceptacion = { 
                                 idOrden: parseInt($scope.ordenSeleccionada.idOrden),
                                  datosFacturacion :$scope.jsonFacturacion,
                                  destinoOrigen : $scope.jsonEnvio,
                                  destinoOrigenBodega : $scope.jsonEnvioShipTo,
                                  datosEntregaRecogida  :$scope.jsonEntrega,
                                  datosOtros: $scope.jsonOtros,
                                  lineas : $scope.lineas ,
                                  usuarioActualizacion:$scope.login.usuario,
                                  idUsuarioActualizacion : parseInt($scope.login.id),                                 
                                  nuevoEstadoOrden :"CONFIRMADA"
                                 };
          console.log("Json envio ACEPTACION");
          console.log(angular.toJson($scope.jsonAceptacion, true));
          console.log('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/ordenes/save',$scope.jsonAceptacion);
          $http.post('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/ordenes/save',$scope.jsonAceptacion)                    
                    .error(function(data, status, headers, config){
                         console.log("error ===>");
                          console.log(status);
                          console.log(data);
                          console.log(headers);
                          console.log(config);                  
                    })
                    .then(function(response){                     
                          $scope.aceptacionRetorno= response.data;
                          console.log("json edicion retorno ===> " );
                          console.log(angular.toJson($scope.aceptacionRetorno, true));
                          if ($scope.aceptacionRetorno.mensajes.severidadMaxima != 'INFO') {
                            alert("error" + $scope.aceptacionRetorno.mensajes.mensajes[0].texto )
                          }else{
                            $scope.mostrarMensajeEdicionExitosa();
                          }

                    });    
          }
          
      }

      $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');        
      $scope.showAdvancedMensajes = function(ev) {      
          var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
          $mdDialog.show({
                controller: DialogCotrollerMensajes,
                templateUrl: './ordenesVenta/mensajesServidor.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: useFullScreen,
                locals: { 
                          serverData: $scope.serverData ,
                          jsonFacturacion :$scope.jsonFacturacion , 
                          productosTemporales :$scope.productosTemporales , 
                          imprimir  : $scope.imprimir ,   
                          tabla :$scope.datatable ,
                          jsonEntregaRetorno :  $scope.jsonEntregaRetorno,
                          login :$scope.login,
                          gridOptions : $scope.gridOptions,
                          esEdicion:$scope.esEdicion,
                          mensajesServidor : $scope.mensajesServidor
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

        function DialogCotrollerMensajes($scope, $mdDialog ,serverData,jsonFacturacion,productosTemporales,imprimir,tabla ,jsonEntregaRetorno , login ,gridOptions  ,esEdicion ,mensajesServidor) 
        {
              $scope.mensajesServidor = mensajesServidor;
              console.log("entra controlador mensajes ");
              console.log($scope.mensajesServidor);
              $scope.cerrarModal = function (){
                  $mdDialog.hide();
              }             
        }


        $scope.showNuevoProducto = function(ev) {        
          var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
          $mdDialog.show({
            controller: DialogCotrollerNuevoProducto,
            templateUrl: './ordenesVenta/agregarNuevoProducto.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:false,
            fullscreen: useFullScreen,
             locals: { serverData: $scope.serverData ,
                       jsonFacturacion :$scope.jsonFacturacion , 
                       productosTemporales :$scope.productosTemporales , 
                       imprimir  : $scope.imprimir ,   
                       tabla :$scope.datatable ,
                       jsonEntregaRetorno :  $scope.jsonEntregaRetorno,
                       login :$scope.login,
                       ordenSeleccionada :$scope.ordenSeleccionada,
                       gridOptions : $scope.gridOptions,
                       esEdicion:$scope.esEdicion,
                       cantidadTotal:$scope.cantidadTotal,
                      tipoUbicacionLineaOrden: $scope.tipoUbicacionLineaOrden , 
                      ciudad : $scope.ciudad ,
                      productosCliente : $scope.productosCliente

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

        function DialogCotrollerNuevoProducto($scope ,$rootScope , $mdDialog ,serverData,jsonFacturacion,productosTemporales,imprimir,tabla ,jsonEntregaRetorno , login ,gridOptions  ,esEdicion ,ordenSeleccionada , productosCliente) 
        {
             //$scope.mensajesServidor = mensajesServidor;
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
              $scope.ordenSeleccionada = ordenSeleccionada ;
              $scope.productosCliente = [];
              $scope.productosCliente = productosCliente;
              console.log("productos");
              console.log($scope.productosCliente);

              $scope.jsonNiveles = []
              $scope.jsonNivel1 = {};
              $scope.jsonNivel1.factorConversion = 1 ; 
              $scope.jsonNivel2 = {};
              $scope.jsonNivel3 = {};
              $scope.campoValidacion = "";
              $scope.jsonDataProducto = {};
              $scope.faltanDatos = false;


              $scope.mostrarMensajeDatosFaltantes = function(ev) {
                
                  $mdDialog.show(
                    $mdDialog.alert()
                      .parent(angular.element(document.querySelector('#popupContainer')))
                      .clickOutsideToClose(true)
                      .title('informacion')
                      .textContent('El campo '+ $scope.campoValidacion +" es obligatorio." )
                      .ariaLabel('Mensaje')
                      .ok('Got it!')
                      .targetEvent(ev)
                 );
              };

              $scope.validar = function (){
                  if($scope.jsonDataProducto.codigoAlterno === undefined){
                  
                         $scope.campoValidacion = "Codigo producto";
                          $scope.faltanDatos = true;

                    //     $scope.mostrarMensajeDatosFaltantes();
                         return;
                         
                  }else if($scope.jsonDataProducto.nombreProductoAlterno === undefined){
                         
                         $scope.campoValidacion = "Nombre producto";
                         $scope.faltanDatos = true;
                      //   $scope.mostrarMensajeDatosFaltantes();
                         return;
                         
                  }else if($scope.jsonNivel1.codigoUnidadAlterno === undefined){
                         
                         $scope.campoValidacion = "Unidad cliente";
                         $scope.faltanDatos = true;
                      //   $scope.mostrarMensajeDatosFaltantes();
                         return;
                         
                  }else if($scope.jsonNivel1.unidadId === undefined){
                         
                         $scope.campoValidacion = "Unidad";
                         $scope.faltanDatos = true;
                      //   $scope.mostrarMensajeDatosFaltantes();
                         return;
                         
                  }else if($scope.jsonNivel1.volumen === undefined){
                         
                         $scope.campoValidacion = "Volumen";
                         $scope.faltanDatos = true;
                      //   $scope.mostrarMensajeDatosFaltantes();
                         return;
                         
                  }else if($scope.jsonNivel1.pesoVolumetrico === undefined){
                         
                         $scope.campoValidacion = "Peso volumetrico";
                         $scope.faltanDatos = true;
                      //   $scope.mostrarMensajeDatosFaltantes();
                         return;
                         
                  }else{

                    $scope.crearNuevo();
                    //console.log("llamar crear ");
                  }                
              }  

              $scope.cerrarModal = function (){
                  $mdDialog.hide();
              }


              $scope.mostrarMensajeCreacionProductoExitosa = function(ev) {
                
                  $mdDialog.show(
                    $mdDialog.alert()
                      .parent(angular.element(document.querySelector('#popupContainer')))
                      .clickOutsideToClose(true)
                      .title('informacion')
                      .textContent('Se ha creado el producto correctamente.')
                      .ariaLabel('Mensaje')
                      .ok('OK')
                      .targetEvent(ev)
                 );
              };

              $scope.crearNuevo = function (){
                $scope.jsonNiveles = [
                                      $scope.jsonNivel1,
                                      $scope.jsonNivel2,
                                      $scope.jsonNivel3
                                     ];

                                
                console.log("json de  nuevo producto")
              //  console.log(angular.toJson($scope.jsonNiveles, true));
                $scope.dataNuevoProducto = {
                                              clienteId :  $scope.jsonFacturacion.cliente,
                                              codigoAlterno : $scope.jsonDataProducto.codigoAlterno ,
                                              nombreAlterno: $scope.jsonDataProducto.nombreProductoAlterno,
                                              valorAproximado : $scope.jsonNivel1.valorDeclarado,
                                              provisional :true ,
                                              usuarioActualizacion :  $scope.login.usuario,                                              
                                              unidadNivel1 :$scope.jsonNivel1 ,
                                              unidadNivel2: $scope.jsonNivel2 ,
                                              unidadNivel3 :$scope.jsonNivel3 
                                            };
                console.log(angular.toJson($scope.dataNuevoProducto, true));
                $http.post('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/productos/save' , $scope.dataNuevoProducto)
                    
                    .error(function(data, status, headers, config){
                         console.log("error ===>");
                          console.log(status);
                          console.log(data);
                          console.log(headers);
                          console.log(config);                  
                    })
                    .then(function(response){
                          $scope.respuesta= response.data;
                           console.log("respuesta ==>");
                           console.log($scope.respuesta);
                                        
                       if ($scope.respuesta.mensajes.severidadMaxima != 'INFO') {
                            alert("error" + $scope.respuesta.mensajes.mensajes[0].texto )

                           }else{
                          $rootScope.cargarProductosCliente( window.localStorage.getItem('clienteCache'),window.localStorage.getItem('tipoServicioCache'));
                           $scope.cerrarModal();
                           $scope.mostrarMensajeCreacionProductoExitosa();
                      }

                });   

            }


              /*******************carga de productos para hacer copia ***********************************/
            $http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/ordenes/productos-x-cliente?id_cliente='+ $scope.jsonFacturacion.cliente+'&id_tipo_servicio='+ $scope.jsonFacturacion.tipoServicio)
                  
                  .error(function(data, status, headers, config){
                       console.log("error ===>");
                        console.log(status);
                        console.log(data);
                        console.log(headers);
                        console.log(config);
                
                  })
                  .then(function(response){
                   
                   $scope.productosCliente= response.data;
                  console.log("json cargado productos ===> " );
                  

                   console.log($scope.productosCliente) ; 

            });  

            /**************************************************************/
            $http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/productos/unidades-x-nivel?nivel=1')
                    
                    .error(function(data, status, headers, config){
                         console.log("error ===>");
                          console.log(status);
                          console.log(data);
                          console.log(headers);
                          console.log(config);                  
                    })
                    .then(function(response){
                     
                     $scope.unidadesNivel1= response.data;
                     console.log("Nivel 1");
                     console.log($scope.unidadesNivel1);
                     
            }); 

             $http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/productos/unidades-x-nivel?nivel=2')
                   
                    .error(function(data, status, headers, config){
                         console.log("error ===>");
                          console.log(status);
                          console.log(data);
                          console.log(headers);
                          console.log(config);                  
                    })
                    .then(function(response){
                     
                     $scope.unidadesNivel2= response.data;
                     console.log("Nivel 2");
                     console.log($scope.unidadesNivel2);
                     
            });   

            $http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/productos/unidades-x-nivel?nivel=3')
                   
                  .error(function(data, status, headers, config){
                       console.log("error ===>");
                        console.log(status);
                        console.log(data);
                        console.log(headers);
                        console.log(config);                  
                  })
                  .then(function(response){
                   
                   $scope.unidadesNivel3= response.data;
                   console.log("Nivel 3");
                   console.log($scope.unidadesNivel3);                     

            });   
             
             $scope.calculaVolumenNivel1= function (){
                          $scope.jsonNivel1.alto    = $scope.jsonNivel1.alto; 
                          $scope.jsonNivel1.largo   = $scope.jsonNivel1.largo; 
                          $scope.jsonNivel1.ancho   = $scope.jsonNivel1.ancho; 
                          $scope.jsonNivel1.volumen = $scope.jsonNivel1.alto * $scope.jsonNivel1.ancho * $scope.jsonNivel1.largo;                                                                  
             }
             $scope.calcularPesoVolumetricoNivel1 = function (){
                          $scope.jsonNivel1.pesoVolumetrico  =   $scope.jsonNivel1.pesoBruto  *  $scope.jsonNivel1.volumen;
             }
             $scope.calculaVolumenNivel2= function (){
                          $scope.jsonNivel2.alto    = $scope.jsonNivel2.alto; 
                          $scope.jsonNivel2.largo   = $scope.jsonNivel2.largo; 
                          $scope.jsonNivel2.ancho   = $scope.jsonNivel2.ancho; 
                          $scope.jsonNivel2.volumen = $scope.jsonNivel2.alto * $scope.jsonNivel2.ancho * $scope.jsonNivel2.largo;                                                    
             }
             $scope.calcularPesoVolumetricoNivel2 = function (){
                            $scope.jsonNivel2.pesoVolumetrico  =   $scope.jsonNivel2.pesoBruto  *  $scope.jsonNivel2.volumen;
             }

              $scope.calculaVolumenNivel3= function (){
                          $scope.jsonNivel3.alto    = $scope.jsonNivel3.alto; 
                          $scope.jsonNivel3.largo   = $scope.jsonNivel3.largo; 
                          $scope.jsonNivel3.ancho   = $scope.jsonNivel3.ancho; 
                          $scope.jsonNivel3.volumen = $scope.jsonNivel3.alto * $scope.jsonNivel3.ancho * $scope.jsonNivel3.largo;                                                                  
             }
             $scope.calcularPesoVolumetricoNivel3 = function (){
                          $scope.jsonNivel3.pesoVolumetrico  =   $scope.jsonNivel3.pesoBruto  *  $scope.jsonNivel3.volumen;
             }

              console.log('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/destinos_origenes/ciudades');
              $http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/destinos_origenes/ciudades')
                  
                  .error(function(data, status, headers, config){
                       console.log("error ===>");
                        console.log(status);
                        console.log(data);
                        console.log(headers);
                        console.log(config);                  
                  })
                  .then(function(response){
                   
                   $scope.ciudades= response.data;
                   console.log("ciudades =>");
                   console.log($scope.ciudades);
                   
              });   
       }
    /************************ventan modal para   destino origen ********************/
       $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');        
       $scope.showDestinoOrigen = function(ev) {        

          var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
          $mdDialog.show({
            controller: DialogCotrollerDestinoOrigen,
            templateUrl: './ordenesVenta/agregarDestinoOrigen.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:false,
            fullscreen: useFullScreen,
             locals: { 
                        serverData: $scope.serverData ,
                        jsonFacturacion :$scope.jsonFacturacion , 
                        productosTemporales :$scope.productosTemporales , 
                        imprimir  : $scope.imprimir ,   
                        tabla :$scope.datatable ,
                        jsonEntregaRetorno :  $scope.jsonEntregaRetorno,
                        login :$scope.login,
                        gridOptions : $scope.gridOptions,
                        esEdicion:$scope.esEdicion,
                        mensajesServidor : $scope.mensajesServidor,
                        ordenSeleccionada :$scope.ordenSeleccionada,
                        origenDestinoTitulo :$scope.origenDestinoTitulo
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

        function DialogCotrollerDestinoOrigen($scope, $mdDialog ,serverData,jsonFacturacion,productosTemporales,imprimir,tabla ,jsonEntregaRetorno , login ,gridOptions  ,esEdicion ,ordenSeleccionada ,origenDestinoTitulo ,  $rootScope ) 
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
              $scope.ordenSeleccionada = ordenSeleccionada ;
              $scope.jsonDestinoOrigen = {};
              $scope.origenDestinoTitulo = origenDestinoTitulo; 
              

             console.log("entra controlador destino origen  ");
            $http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/destinos_origenes/segmentos-x-cliente?id_cliente='+$scope.jsonFacturacion.cliente)
                 
                .error(function(data, status, headers, config){
                     console.log("error ===>");
                      console.log(status);
                      console.log(data);
                      console.log(headers);
                      console.log(config);                  
                })
                .then(function(response){
                 
                 $scope.segmentosDestinoOrigen= response.data;
                 console.log("Segmentos =>");
                 console.log($scope.segmentosDestinoOrigen);                   

            });   
            
             $scope.cargarDestinatario = function (){
                console.log('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/destinos_origenes/destinatarios_remitentes-x-cliente-x-segmento?id_cliente='+$scope.jsonFacturacion.cliente+'&id_segmento='+$scope.jsonDestinoOrigen.segmentoId);
                $http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/destinos_origenes/destinatarios_remitentes-x-cliente-x-segmento?id_cliente='+$scope.jsonFacturacion.cliente+'&id_segmento='+$scope.jsonDestinoOrigen.segmentoId)
                   
                    .error(function(data, status, headers, config){
                         console.log("error ===>");
                          console.log(status);
                          console.log(data);
                          console.log(headers);
                          console.log(config);                  
                    })
                    .then(function(response){
                     
                     $scope.destinatarioOrigen= response.data;
                     console.log("destinatarios =>");
                     console.log($scope.destinatarioOrigen);
                     

                });   
             }

        
            console.log('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/destinos_origenes/ciudades');
            $http.get('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/destinos_origenes/ciudades')
                
                .error(function(data, status, headers, config){
                     console.log("error ===>");
                     console.log(status);
                     console.log(data);
                     console.log(headers);
                     console.log(config);                  
                })
                .then(function(response){
                 
                    $scope.ciudades= response.data;
                    console.log("ciudades =>");
                    console.log($scope.ciudades);                 
            });   

             $scope.setDestinatario = function (id){

                $scope.jsonDestinoOrigen.destinatarioRemitenteId = id ;

             }
             $scope.setCiudad = function (id){
                $scope.jsonDestinoOrigen.ciudadId = id ; 

             }
             $scope.cerrarModal = function(){
                console.log("entra");
                $mdDialog.hide()

               }
                $scope.faltanDatosShip = false ;
                $scope.validarCreacion = function (){
                //  alert("entra");
                 if($scope.jsonFacturacion.destinatario === undefined){
                  
                         $scope.campoValidacionDestinoShip = "Destinatario";
                          $scope.faltanDatosShip = true;

                    //     $scope.mostrarMensajeDatosFaltantes();
                         return;
                         
                  }else if($scope.jsonDestinoOrigen.ciudadId === undefined){
                         
                         $scope.campoValidacionDestinoShip = "Ciudad";
                         $scope.faltanDatosShip = true;
                      //   $scope.mostrarMensajeDatosFaltantes();
                         return;
                         
                  }else if($scope.jsonDestinoOrigen.direccion === undefined){
                         
                         $scope.campoValidacionDestinoShip = "Dirección";
                         $scope.faltanDatosShip = true;
                      //   $scope.mostrarMensajeDatosFaltantes();
                         return;
                         
                  }else{

                    $scope.crearDestinatario();
                    //console.log("llamar crear ");
                  }              
              }

             $scope.crearDestinatario  = function (){
                   $scope.nuevoDestinatario = {
                                              //clienteId :   $scope.jsonFacturacion.cliente,
                                              //segmentoId :  $scope.jsonDestinoOrigen.segmentoId ,
                                              destinatarioRemitenteId: $scope.jsonFacturacion.destinatario,
                                              codigo : $scope.jsonDestinoOrigen.codigo,
                                              nombre :$scope.jsonDestinoOrigen.nombre ,
                                              ciudadId :  parseInt($scope.jsonDestinoOrigen.ciudadId),
                                              direccion : $scope.jsonDestinoOrigen.direccion,
                                              indicacionesDireccion : $scope.jsonDestinoOrigen.indicaciones,
                                              contactoNombres : $scope.jsonDestinoOrigen.nombres,
                                              contactoEmail : $scope.jsonDestinoOrigen.email,
                                              contactoTelefonos: $scope.jsonDestinoOrigen.telefono,
                                              usuarioActualizacion :  $scope.login.usuario,
                                            };
                  console.log("json envio destinatario  =>");
                  console.log(angular.toJson($scope.nuevoDestinatario, true));
                  console.log('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/destinos_origenes/save',$scope.nuevoDestinatario);                         
                 
                  $http.post('http://'+ $scope.serverData.ip+':'+ $scope.serverData.puerto+'/'+contexto+'/destinos_origenes/save',$scope.nuevoDestinatario)
                     
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
                          console.log('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/'+contexto+'/ordenes/destinos_origenes-x-destinatario_remitente-x-ciudad?id_destinatario_remitente='+$scope.jsonFacturacion.destinatario+'&id_ciudad='+$scope.jsonDestinoOrigen.ciudadId+'&id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio)              
                           $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/'+contexto+'/ordenes/destinos_origenes-x-destinatario_remitente-x-ciudad?id_destinatario_remitente='+$scope.jsonFacturacion.destinatario+'&id_ciudad='+$scope.jsonDestinoOrigen.ciudadId+'&id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio)              
                                .error(function(data, status, headers, config){
                                    console.log("error ===>");
                                    console.log(status);
                                    console.log(data);
                                    console.log(headers);
                                    console.log(config);
                              
                                })
                                .then(function(response){        
                                  $rootScope.destino=[];
                                  $rootScope.destino= response.data;       
                                  
                                  
                                   console.log("json cargado destino ===> " );
                                   console.log( $rootScope.destino) ; 
                              });    
                               $http.get('http://'+$scope.serverData.ip+':'+$scope.serverData.puerto+'/'+contexto+'/ordenes/ciudades-x-destinatario_remitente?id_destinatario_remitente='+$scope.jsonFacturacion.destinatario+'&id_tipo_servicio='+$scope.jsonFacturacion.tipoServicio )
                                         
                                            .error(function(data, status, headers, config){
                                              console.log("error ===>");
                                              console.log(status);
                                              console.log(data);
                                              console.log(headers);
                                              console.log(config);
                                          
                                            })
                                            .then(function(response){
                                             
                                              $scope.ciudad= response.data;
                                              $rootScope.ciudad= [];
                                              $rootScope.ciudad= $scope.ciudad ;
                                              $scope.cerrarModal();
                                             console.log("json cargado ciudad ===> ");
                                             console.log($scope.ciudad);
                                        

                              });       
                          }                       
                   });  
             }
        }         
}])



.filter('currencyFilter', function () {

  
  return function (value, scope) {
    
      if(value === "" || value === null || value === undefined){    
          return  '$ 0';
      }else{    
          return  '$ '+parseInt(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1.');
      }
      
    }
})


.filter('medidaFilter', function () {

  
  return function (value, scope) {

       console.log(value);
      if(parseInt(value) == 1 ){    
          return  'UNIDAD';
      }  
      if(parseInt(value) == 2 ){    
          return  'CAJA';
      }
      if(parseInt(value) == 4 ){    
          return  'KILO';
      }
      
    }
})
		
.filter('productoFilter', function () {

  
  return function (value, scope) {
    //    console.log(value);
    //    console.log(scope);
     // console.log("nombre  producto = " + scope.row.entity.nombreProducto);
     
      if(angular.isUndefined(scope.row)){
        //console.log("Entra this");
        return value; 
      }  
      if(value === ''){
       // console.log("Entra vacio");
        return '' ; 
      }else{
        //console.log("Entra row" + scope.row.entity.nombreProducto );
        //console.log("Entra row valor " + value);

        if(angular.isUndefined(scope.row.entity.nombreProducto)){
            //console.log("entro if solo valor");
            return    value   ;   
        }else{

           //console.log("entro if solo valor con id " + value);
           //console.log("entro if solo valor con nombre producto " + scope.row.entity.nombreProducto  );
           var valorSplit = value.split("|");
           //console.log(valorSplit.length);          
           if(valorSplit.length === 1){
              return  scope.row.entity.nombreProducto  +' | '+  value ;   
           }else{
               return    value   ;   
           }

          
        }
        
      }  
      
      
    }
})
    
