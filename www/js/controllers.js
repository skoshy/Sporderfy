angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $q, $http, $ionicModal, $cordovaOauth, $timeout, dataFact) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.user = dataFact.user;
  $scope.appData = dataFact.appData;

  // Debug
  appData = dataFact.appData;

  $scope.spotify = {
    uri: 'https://accounts.spotify.com/authorize'
    ,response_type: 'code'
    ,client_id: '5704b7589cb0485584a0e368da6d0c5e'
    ,redirect_uri: '/playlists'
    ,scope: [
      'playlist-read-private'
      ,'playlist-read-collaborative'
      ,'playlist-modify-public'
      ,'playlist-modify-private'
      ,'user-library-read'
      ,'user-library-modify'
    ]
  };

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  console.log(dataFact.getData('access_token'));

  /****
  ===== Important Functions
  ****/

  // Triggered in the login modal to close it
  $scope.closeLogin = function() { $scope.modal.hide(); };

  // Open the login modal
  $scope.login = function() { $scope.modal.show(); };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('OAuth here:');

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $cordovaOauth.spotify($scope.spotify.client_id, $scope.spotify.scope, {show_dialog: true}).then(function(result) {
        // Access token: result.access_token
        // Expires in: result.expires_in
        dataFact.setData('access_token', result.access_token);
        
        dataFact.afterLogin();
    }, function(error) {
        console.log(error);
    });
  };

  if (dataFact.getData('access_token') != '')
    dataFact.afterLogin();
})

.controller('PlaylistsCtrl', function($scope, dataFact) {
  $scope.user = dataFact.user;
  $scope.appData = dataFact.appData;
})

.controller('PlaylistCtrl', function($scope, $stateParams, dataFact) {
  $scope.user = dataFact.user;
  $scope.appData = dataFact.appData;
  $scope.playlistId = $stateParams.playlistId;

  var playlistData = dataFact.getPlaylist(0, $stateParams.playlistId);
});
