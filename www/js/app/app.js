// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('lf', [ 'ionic',
  					 'ionic.cloud',
  					 'pascalprecht.translate',
  					 'angularMoment',
  					 'nl2br',
  					 'firebase',
  					 'lf.services.office', 
  					 'lf.services.category',
  					 'lf.services.item',
					 'lf.services.image',
  					 'lf.directives.map',
  					 'lf.services.camera'])

.run(function($ionicPlatform, $ionicLoading, $ionicPush, $rootScope, $translate, $firebaseObject, OfficeService, CategoryService, ItemService, amMoment, constants) {
	//Save Firebase reference and load it into the rootscope
	$rootScope.data = {};
	$rootScope.settings = {
		alerts: window.localStorage.getItem('settings.alerts') == "true"
	};

	firebase.initializeApp(constants.FIREBASE_CONFIG);
	console.log('Database initialized');

	if (window.localStorage.getItem('settings.alerts') === undefined)
		window.localStorage.setItem('settings.alerts', true);

	if (window.localStorage.getItem('settings.alerts') === true) {
		//Register Ionic Push device token
		$ionicPush.register().then(function(t) {
			return $ionicPush.saveToken(t);
		}).then(function(t) {
			window.localStorage.setItem('pushToken', t);
			//save token to Firebase?
		});
	}

	$rootScope.showLoading = function()  {
		$ionicLoading.show({ template: 'Loading...', noBackdrop:true });
	};

	$rootScope.hideLoading = function()  {
		$ionicLoading.hide();
	};

	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if(window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if(window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
		}
		
		//Check user authentication
		//var auth = $rootScope.ref.getAuth();
		var auth = firebase.auth().user;

		if(!!auth){
			console.log(auth);
			$rootScope.data.currentUser = $firebaseObject(firebase.database().ref('users').child(auth.uid));
			$rootScope.data.currentUser.$loaded().then(function () {
				console.log($rootScope.data.currentUser.name);
				console.log($rootScope.data.currentUser.language);
				$translate.use($rootScope.data.currentUser.language);
				amMoment.changeLocale($rootScope.data.currentUser.language);
			});
		}else{
			// usuario no autetificado
			if (window.localStorage.getItem('settings.language')) {
				$rootScope.settings.language = window.localStorage.getItem('settings.language');
				$translate.use($rootScope.settings.language);
				amMoment.changeLocale($rootScope.settings.language);			
		//	} else if (typeof navigator.globalization !== "undefined") {
		//		navigator.globalization.getPreferredLanguage(function(language) {
		//			$rootScope.settings.language = (language.value).split("-")[0];
		//			$translate.use($rootScope.settings.language);
		//			amMoment.changeLocale($rootScope.settings.language);
		//		}, null);
			} else {
				$rootScope.settings.language = "eu";	
				$translate.use($rootScope.settings.language);       			
				amMoment.changeLocale($rootScope.settings.language);	
			}
		}

		$rootScope.languages = [
			{ code: "en",
			  name: "English" },
			{ code: "es",
			  name: "Español" },
			{ code: "eu",
			  name: "Euskara" }
		];

			
		(function(d, s, id){
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) {return;}
			js = d.createElement(s); js.id = id;
			js.src = "//connect.facebook.net/en_US/sdk.js";
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));

		initAppInfo();    
	});

	function initAppInfo() {
		//$ionicLoading.show({ template: 'Iniciando aplicacion...', noBackdrop:true });
		OfficeService.loadOffice(function(error,office){
			$rootScope.office = office;
			//$ionicLoading.hide();
			if (navigator.splashscreen)
				navigator.splashscreen.hide();
		});
	}
	
	navigator.geolocation.watchPosition(function(pos) {
		$rootScope.currentLocation = pos.coords;
	}, function(error) {
		$rootScope.currentLocation = {
			"latitude" : constants.OFFICE_LAT,
			"longitude" : constants.OFFICE_LON 
		};
	}, {
		"enableHighAccuracy": false,
		"timeout": 5000,
		"maximumAge": Infinity
	});
})

.constant('angularMomentConfig', {
	//preprocess: 'unix', // optional
	timezone: 'Europe/Madrid' // optional
})

.config(function($ionicCloudProvider, $stateProvider, $urlRouterProvider, constants) {
	$ionicCloudProvider.init({
		"core": {
			"app_id": constants.IONIC_APP_ID  
		},
		"push": {
			"sender_id": constants.SENDER_ID,
			"pluginConfig": {
				"ios": {
					"badge": true,
					"sound": true
				},
				"android": {
					"iconColor": "#343434"
				}
			}
		}	
	});

	$stateProvider
	.state('app', {
		url: "/app",
		abstract: true,
		templateUrl: "js/app/components/main/menu.html",
		controller: 'AppCtrl'
	})
	.state('app.foundItems', {
		url: "/found_items",
		views: {
			'menuContent': {
				templateUrl: "js/app/components/founditems/founditems.html",
				controller: 'FoundItemsCtrl'
			}
		}
	})
	.state('app.item', {
		url: "/found_items/:itemId",
		views: {
			'menuContent': {
				templateUrl: "js/app/components/founditem/founditem.html",
				controller: 'FoundItemCtrl'
			}
		}
	})
	.state('app.officeMessages',{
		url: "/found_items/messages/:item",
		views: {
			'menuContent': {
				templateUrl: "js/app/components/message/alert/alertmessage.html",
				controller: 'OfficeMessageCtrl'
			}
		}
	})
	.state('app.alertMessages', {
		url: "/alert_items/messages/:item",
		views: {
			'menuContent': {
				templateUrl: "js/app/components/message/alert/alertmessage.html",
				controller: "AlertMessageCtrl"
			}
		}
	})
	.state('app.alerts', {
		url: "/alerts",
		views: {
			'menuContent': {
				templateUrl: "js/app/components/alerts/alerts.html",
				controller: "AlertsCtrl"
			}
		}
	})
	.state('app.alertitem', {
		url: "/alerts/:item",
			views: {
				'menuContent': {
					templateUrl: "js/app/components/alertitem/alertitem.html",
					controller: 'AlertItemCtrl'
			}
		}
	})
	.state('app.launchAlert', {
		url: "/launch_alert",
		views: {
			'menuContent' :{
				templateUrl: "js/app/components/launchalert/launchalert.html",
				controller: 'LaunchAlertCtrl'
			}
		}
	})
	.state('app.info', {
		url: '/info',
		views: {
			'menuContent' :{
				templateUrl: 'js/app/components/info/info.html',
				controller: 'InfoCtrl'
			}
		}
	})
	.state('app.settings', {
		url: '/settings',
		views: {
			'menuContent': {
				templateUrl: 'js/app/components/settings/settings.html',
				controller: 'SettingsCtrl' 
			}
		}
	})
	.state('app.signup', {
		url: "/signup",
		views: {
			'menuContent' :{
				templateUrl: "js/app/components/signup/signup.html",
				controller: 'SignUpCtrl'
			}
		}
	});

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/app/found_items');
});

