//js/modules/homePage/homeView.js

define(['marionette', 'templates', 'modules/geolocate', 'autocomplete'], function(Marionette, templates, Geo) {

	var SubApp = SubApp || {};

	SubApp.HomeUserView = Marionette.ItemView.extend({
		initialize: function(options) {
			this.model = this.options.model;
		},
		model: this.model,
		getTemplate: function() {
			if (this.model.get('email')) {
				return templates.homeUserActive;
			} else {
				return templates.homeUser;
			}
		},
		modelEvents: {
			"change": "modelChanged",
			"destroy": "modelChanged"
		},
		modelChanged: function() {
			this.render();
		},
		onRender: function() {
			var isMobile = false;
			if (window.navigator) {
				isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|Windows Phone|BlackBerry|Mobile)/);
			}
			if (isMobile) {
				this.$('ul').css('position', 'absolute');
			}
		}
	});

	console.log('home search view successfully loaded');
	return SubApp;
});
