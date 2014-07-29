// js/modules/sidenavView.js
console.log('SidenavView.js loaded!');

define(['marionette', 'templates', 'modules/loading', 'modules/tooltip'], function(Marionette, templates, Loading, Tooltip) {
	console.log('Sidenav View success');
	var Sidenav = {},
		isMobile = false;
	if (window.navigator) {
		isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|Windows Phone|BlackBerry|Mobile)/);
	}

	// Results Side Nav with saved searches module
	Sidenav.ResultsView = Marionette.ItemView.extend({
		initialize: function(options) {
			var that = this;
			this.userModel = options.userModel;
			this.listenTo(this.userModel, 'change', this.render);
			this.searchModel = options.searchModel;
		},
		getTemplate: function() {
			return templates.sidenav;
		},
	});
	// Subpage Side Nav
	Sidenav.View = Marionette.ItemView.extend({
		initialize: function(options) {
			this.userModel = this.options.userModel;
		},
		getTemplate: function() {
			return templates.sidenav;
		}
	});

	return Sidenav;
});
