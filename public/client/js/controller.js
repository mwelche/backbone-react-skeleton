define(['marionette', 'modules/footerView', 'modules/pageview'], function(Marionette, Footer, Pageview) {
	var that;
	var Controller = Marionette.Controller.extend({
		initialize: function(options) {
			// Save options values into scope of the Controller.
			this.app = options.app;
			this.Layout = this.Layout || {};
		},
		home: function() {
			// Layout Object
			var homeLayout = this.Layout;
			// App object from initialized options
			that = this;
			console.log('HOME',this);
			require(['modules/twoRegionLayout', 'modules/homeView'], function(Layout, Home) {
				// Layout
				homeLayout = {};
				homeLayout = new Layout();
				that.app.content.show(homeLayout);

				var homeView = new Home.View();
				var footerView = new Footer.View();

				// Show Views in regions of layout
				homeLayout.content.show(homeView);
				homeLayout.footer.show(footerView);
			});
			Pageview.countPageView();
		}
	});

	return Controller;
});
