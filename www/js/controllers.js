angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $http, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  var spotify_permissions = [
    'playlist-read-private'
    ,'playlist-read-collaborative'
    ,'playlist-modify-public'
    ,'playlist-modify-private'
    ,'user-library-read'
    ,'user-library-modify'
  ];

  $scope.spotify = {
    uri: 'https://accounts.spotify.com/authorize'
    ,response_type: 'code'
    ,client_id: '5704b7589cb0485584a0e368da6d0c5e'
    ,redirect_uri: '/playlists'
    ,scope: spotify_permissions.join('%20')
  };

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('here:');

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $http({
      method: 'GET'
      ,url: 'https://accounts.spotify.com/authorize'
      ,params: $scope.spotify
    }).then(function successCallback(response) {
      console.log(response);

      $http({
        method: 'POST'
        ,url: 'https://accounts.spotify.com/api/token'
        ,params: {
          grant_type: 'authorization_code'
          ,code: ''
        }
      }).then(function successCallback(response) {
        console.log(response);
        $scope.closeLogin();
      }, function errorCallback(response) {
        console.log(response);
        $scope.closeLogin();
      });

      $scope.closeLogin();
    }, function errorCallback(response) {
      console.log(response);
      $scope.closeLogin();
    });
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
