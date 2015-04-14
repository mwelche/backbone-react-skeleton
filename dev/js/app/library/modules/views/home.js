//js/modules/homeView.js

define(['marionette', 'templateConfig'], function(Marionette, templates) {

	var Home = Home || {};

	Home.View = Marionette.ItemView.extend({
		initialize: function(options) {
			return;
		},
		template: templates.home,
		tagName: 'div',
		className: 'home',
	});

	console.log('home view successfully loaded');
	return Home;
});
