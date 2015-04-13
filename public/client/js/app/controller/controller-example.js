var Controller;
define(['marionette',
		'modules/models/search',
		'modules/models/unsub',
		'modules/search/searchView',
		'modules/sidenavView',
		'modules/pageview',
		'typeahead',
		'jsonp',
		'placeholder'],
		function(Marionette, Search, Unsub, Searchview, Sidenav, Pageview) {
	 Controller = Marionette.Controller.extend({
		initialize: function(options) {
			// Save options values into scope of the Controller.
			this.app = options.app;
			// User Model
			this.userModel = options.model;
			this.Layout = this.Layout || {};
			// Search Model
			this.searchModel = new Search.Model();
			console.log('search model', this.searchModel);
			// Results Collection
			this.results = new Search.Results();
			// Unsub Model
			this.unsubModel = new Unsub.Model();
		}
        });	

	function jobTitleOnlyHandler(q, model) {
		q = q || '';
		if (q.slice(0,7).toLowerCase() === 'title:(') {
			model.set({ jto: true });
			q = q.slice(7, q.length-1);
			return q;
		} else {
			model.set({ jto: false });
			return q;
		}
	}

	return Controller;
});
