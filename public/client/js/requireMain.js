// js/requireMain.js

require.config({
	paths: {
		// App
		"app": "app/app",
		"routes": "app/config/routes",
		// Models
		"user": "app/models/user",
		// Controllers
		"controller": "app/controller/controller",
		"homeController": "app/controller/home",
		"loginController": "app/controller/login",
		// Views
		"homeView": "app/library/modules/views/homeView",
		"footerView": "app/library/modules/views/footerView",
		// Layouts
		"twoRegionLayout": "app/library/modules/views/twoRegionLayout",
		// libs
		"jquery": "lib/jquery-1.10.2.min",
		"underscore": "lib/underscore.min",
		"backbone": "lib/backbone.min",
		"marionette": "lib/backbone.marionette.min",
		// Services
		// Utilities
		"util": "app/library/utility/utility",
		"ajaxUtil": "app/library/utility/ajax",
		"domUtil": "app/library/utility/dom",
		"vent": "app/library/utility/vent", // Event Aggrigator
		// Templates
		"tpl": "lib/require/tpl.min",
		"templates": "app/templates",
		"templateConfig": "app/templates/config",
		// Mobile
		"fastclick": "lib/fastclick.min",
		// Client Storage
		"localStorage": "lib/backbone.localStorage.min",
		"cookie": "lib/jquery.cookie",
		// Async Modules
		"async": "lib/require/async",
		"jsonp": "lib/jquery.jsonp",
		// IE8 support
		"placeholder": "lib/placeholder.min",
		"remjs": "lib/rem.min"
	},
	shim: {
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: ["underscore", "jquery"],
			exports: "Backbone"
		},
		marionette: {
			deps: ["backbone"],
			exports: "Marionette"
		}
	},
	urlArgs: "bust=" + (new Date()).getTime()
});

require(["marionette", "cookie", "localStorage", "remjs"], function (Marionette) {
	"use strict";
	console.log('jquery version: ', $.fn.jquery);
	console.log('underscore identity call: ', _.identity(5));
	console.log('Marionette: ', Marionette);
	var isMobile = false;
	if (window.navigator) { 
		isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|Windows Phone|BlackBerry|Mobile)/);
	}

	require(["app"], function(App) {
		// FASTCLICK
		if (isMobile) {
			require(["fastclick"], function(FastClick) {
				FastClick.attach(document.body);
			});
		}

		App.start();
		console.log('app started');
		console.log(App);
	});
});
