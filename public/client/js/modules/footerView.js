//js/modules/footerView.js

define(['marionette', 'templates'], function(Marionette, templates) {

	var Footer = Footer || {};

	Footer.View = Marionette.ItemView.extend({
		initialize: function(options) {
			return;
		},
		template: templates.footer,
		tagName: 'div',
		className: 'footer',
	});

	console.log('footer view successfully loaded');
	return Footer;
});
