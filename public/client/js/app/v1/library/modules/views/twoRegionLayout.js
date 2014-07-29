// js/modules/twoRegionLayout.js

define(['marionette', 'templateConfig'], function(Marionette, templates) {
	// Two Region Layout
	var TwoRegionLayout = Marionette.Layout.extend({
		template: templates.twoRegionLayout,
		regions: {
			content: '#content',
			footer: '#footer'
		},
		onShow: function() {
		}
	});

	console.log('two region layout successfully loaded');
	return TwoRegionLayout;
});