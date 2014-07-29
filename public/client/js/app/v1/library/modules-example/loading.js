// js/modules/loading

define(['marionette', 'templates'], function(Marionette, templates) {
	var Loading = {};
	Loading.ResultsView = Marionette.ItemView.extend({
		template: templates.loading
	});
	Loading.SavedSearchView = Marionette.ItemView.extend({
		initialize: function(options) {
			this.alertsCollection = this.options.alertsCollection;
		},
		getTemplate: function() {
			if (this.alertsCollection.length === 0) {
				return templates.noSavedSearches;
			} else {
				return templates.loading;
			}
		},
		collectionEvents: {
			'change': 'collectionChanged'
		},
		collectionChanged: function() {
			this.render();
		}
	});
	console.log('success loading the Loading Module');

	return Loading;
});
