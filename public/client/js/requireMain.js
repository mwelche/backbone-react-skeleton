// js/requireMain.js

require.config({
	paths: {
		"jquery": "lib/jquery-1.10.2.min",
		"underscore": "lib/underscore-min",
		"backbone": "lib/backbone",
		"marionette": "lib/backbone.marionette",
		"retina": "lib/retina",
		"cookie": "lib/jquery.cookie",
		"tpl": "lib/tpl"
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
		},
		indeed: {
			deps: ["apiresults"]
		}
	},
	urlArgs: "bust=" +  (new Date()).getTime()
});

require(["marionette", "retina", "cookie"], function (Marionette) {
	"use strict";

	console.log('jquery version: ', $.fn.jquery);
	console.log('underscore identity call: ', _.identity(5));
	console.log('Marionette: ', Marionette);

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
	});
});
