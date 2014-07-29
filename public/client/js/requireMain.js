// js/requireMain.js

// Allow versioning
var versions = {
	default: 'v1',
	v1: true,
	v2: false
};
var query, kv_pair, get, version='v1';
    query = location.search.substring(1);
    query = query.split("&");
    get = {};
for(var key in query){
	kv_pair = query[key].split("=");
	if (typeof kv_pair[0] === "string" && kv_pair[0] === "v" ) {
		version = 'v'+kv_pair[1];
	}
}
require.config({
	paths: {
		// App
		"app": "app/"+version+"/app",
		"routes": "app/"+version+"/config/routes",
		// Models
		"user": "app/"+version+"/models/user",
		// Controllers
		"controller": "app/"+version+"/controller/controller",
		"homeController": "app/"+version+"/controller/home",
		"loginController": "app/"+version+"/controller/login",
		// Views
		"homeView": "app/"+version+"/library/modules/views/homeView",
		"footerView": "app/"+version+"/library/modules/views/footerView",
		// Layouts
		"twoRegionLayout": "app/"+version+"/library/modules/views/twoRegionLayout",
		// libs
		"jquery": "lib/jquery-1.10.2.min",
		"underscore": "lib/underscore.min",
		"backbone": "lib/backbone.min",
		"marionette": "lib/backbone.marionette.min",
		// Services
		// Utilities
		"util": "app/"+version+"/library/utility/utility",
		"ajaxUtil": "app/"+version+"/library/utility/ajax",
		"domUtil": "app/"+version+"/library/utility/dom",
		"vent": "app/"+version+"/library/utility/vent", // Event Aggrigator
		// Templates
		"tpl": "lib/require/tpl.min",
		"templates": "app/"+version+"/templates",
		"templateConfig": "app/"+version+"/templates/config",
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

	// FASTCLICK
	if (isMobile) {
		require(["fastclick"], function(FastClick) {
			FastClick.attach(document.body);
		});
	}

	// View animation.
	Marionette.Region.prototype.open = function(view){
		var that = this;
		$(document).ready(function() {
			console.log(that.$el.selector);
			that.$el.hide();
			that.$el.html(view.el);
			if ((that.$el.selector === "#modal") || (that.$el.selector === "#header") || (that.$el.selector === "#main-content")) {
				that.$el.show();
			} else {
				that.$el.fadeIn(300);
			}
		});
	};

	require(["app"], function(App) {
		App.start();
		console.log('app started');
		console.log(App);
	});
});
