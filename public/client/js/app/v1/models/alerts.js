// js/modules/models/alerts.js

console.log('alerts.js loaded.');
define(['marionette'], function(Marionette) {
	var Alert = {};

	Alert.Model = Backbone.Model.extend({
		defaults: {
			alert_id: '',
			keyword: '',
			location: '',
			frequency: {
				type: 'Daily',
				weekday: ''
			},
			active: true
		},
		idAttribute: 'alert_id',
		sync: function(method, collections, options) {
			options.dataType = "json";
			return Backbone.sync(method, collections, options);
		}
	});

	Alert.Collection = Backbone.Collection.extend({
		url: location.protocol + "//api." + location.hostname + "/server/alert/",
		model: Alert.Model
	});

	console.log('success loading Alerts model');
	return Alert;
});
