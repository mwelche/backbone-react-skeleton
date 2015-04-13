define(['marionette'], function(Marionette) {
	var that;
	var Controller = Marionette.Controller.extend({
		initialize: function(options) {
			// Save options values into scope of the Controller.
			this.app = options.app;
		},
		home: function() {
			var that = this;
			require(['homeController'], function(homeController) {
				console.log(homeController);
				homeController.apply(that);
			});
		}
	});
	return Controller;
});
