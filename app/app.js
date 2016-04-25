'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.ordenesVenta',  
  'myApp.version',
  'ngMaterial',
  'ultimateDataTableServices',
   'myApp.listaOrdenes',
   'myApp.editarOrden',
   'myApp.login',
   'myApp.cargue',
  'myApp.cargueExcel',
   'myApp.corteDicermex',
   'myApp.moviles',
   'ui.grid',   
   'tactic.services',
    'ui.grid.selection',
    'ui.grid.resizeColumns',
    'ui.grid.edit', 
    'ui.grid.rowEdit',
     'ui.grid.cellNav',
     'pascalprecht.translate',
     'base64'
   

]).config(['$routeProvider', '$mdThemingProvider','$translateProvider', function($routeProvider ,$mdThemingProvider ,$translateProvider) {


  $translateProvider.useStaticFilesLoader({
  prefix: './languages/',
  suffix: '.json'
});

   /* $translateProvider.translations('en', {
    GESTION_ORDENES: 'Order gestion'
  })
  .translations('es', {
    GESTION_ORDENES: 'Gestion de ordenes'
  });*/
 
 // pegar en el controllador   para  cambiar el idioma  dinamicamente
 /* 
  app.controller('TranslateController', function($translate, $scope) {
  $scope.changeLanguage = function (langKey) {
    $translate.use(langKey);
  };
});

 */


  $translateProvider.preferredLanguage('en');

     var neonRedMap = $mdThemingProvider.extendPalette('red', {
    '500': '444'
  });
      var colorNegroMap = $mdThemingProvider.extendPalette('grey', {
    '500': '555'
  });
  // Register the new color palette map with the name <code>neonRed</code>
  $mdThemingProvider.definePalette('neonRed', neonRedMap);
  $mdThemingProvider.definePalette('gris', colorNegroMap);
  // Use that theme for the primary intentions
  $mdThemingProvider.theme('default')
    .primaryPalette('neonRed')
   
  $routeProvider.otherwise({redirectTo: '/login'});

}

]);

