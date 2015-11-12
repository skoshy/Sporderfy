angular.module('starter.services', [])

.factory('dataFact', function($http, $q) {
	var user = {display_name: 'Not logged in'};
	var appData = {};
	appData.playlists = [];
	appData.playlistTracks = [];

	var storage = window.localStorage;

	function setData(key, data) {
		storage[key] = data;
	}

	function getData(key) {
		return storage[key];
	}

	function authHttpHeader() {
	    return 'Bearer ' + window.localStorage['access_token'];
	}

	// Synchronously does a HTTP request. Will return a promise object
	function requestSynch(method, url, authNeeded, params) {
		// Determine if we need to auth or not
		if (authNeeded) var headers = { 'Authorization': authHttpHeader() };
		else var headers = {};

		if (params == undefined) params = {};

		var deferred = $q.defer();

		// Make the call
		$http({ method: method, headers: headers ,url: url, params: params})
			.then(function successCallback(response) {
				deferred.resolve(response);
			}, function errorCallback(response) {
				deferred.reject(response);
		});

		return deferred.promise;
	}

	function getPlaylist(offset, playlistId) {
		promise = requestSynch('GET', 'https://api.spotify.com/v1/users/'+user.id+'/playlists/'+playlistId+'/tracks', true, {limit: 100, offset: offset});
		promise.then(function(response){
			console.log(response);

			if (appData.playlistTracks[playlistId] === undefined)
				appData.playlistTracks[playlistId] = response.data.items;
			else
				appData.playlistTracks[playlistId] = appData.playlistTracks[playlistId].concat(response.data.items);

			console.log(appData.playlistTracks);

			if (response.data.total > appData.playlistTracks[playlistId].length)
				getPlaylist(appData.playlistTracks[playlistId].length, playlistId);
		});
	}

	function getAllPlaylists(offset) {
		promise = requestSynch('GET', 'https://api.spotify.com/v1/users/'+user.id+'/playlists', true, {limit: '50', offset: offset});
		promise.then(function(response){
			appData.playlists = appData.playlists.concat(response.data.items);

			if (response.data.total > appData.playlists.length)
				getAllPlaylists(appData.playlists.length);
		});
	}

	function afterLogin() {
		// Get user's data
		promise = requestSynch('GET', 'https://api.spotify.com/v1/me', true);
		promise.then(function(response) {
		  // Set user's name and ID
		  console.log(JSON.stringify(response));
		  user.display_name = response.data.display_name;
		  user.id = response.data.id;

		  // Get user's playlists
		  getAllPlaylists(0);
		}, function(response) {
			// Didn't authenticate
			console.log('Authentication failed, try again');
			storage['access_token'] = '';
		});
	}

	return {
		user: user
		,appData: appData

		,getData: getData
		,setData: setData
		,afterLogin: afterLogin
		,getPlaylist: getPlaylist
	};
});