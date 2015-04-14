// js/modules/subpages/subpageLayout.js

define(['marionette', 'templates'], function(Marionette, templates) {
	var Subpage = {};
	//Results Page Layout
	Subpage.Layout = Marionette.Layout.extend({
		initialize: function(options) {
			this.app = this.options.app;
		},
		template: templates.subpageLayout,
		className: 'container resultsLayout',
		regions: {
			left: '#side-nav',
			middle: '#middleContent'
		},
		events: {
			'click .navicon':'showMobileNav'
		},
		showMobileNav: function() {
			$(".primary-nav").toggleClass("active");
		},
		activeRoute: function() {
			var route = '#' + this.app.getCurrentRoute();
			console.log("the route!!:", route);
			$('.left li').removeClass('active');
			$('.left a').each(function() {
				if ($(this).attr('href') === route) {
					$(this).parent('li').addClass('active');
				}
			});
		},
		onShow: function() {
			var retina = window.devicePixelRatio > 1;
			if (retina) {
				this.$('.logo img').attr('src', 'images/logoresult@2x.png');
			}
		}
	});
	console.log('Subpage layout successfully loaded');
	return Subpage;
});
