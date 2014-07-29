// js/modules/models/unsub.js

console.log('unsub.js loaded.');
define(['marionette'], function(Marionette) {
	var Unsub = {};

	Unsub.Model = Backbone.Model.extend({
		defaults: {
			user_id: '',
			site_id: 7,
			email: '',
			sub_id: '', // campaign name
			partner: '',
			source: '',
			details: ''  // notes like manually unsubscribed
		}
	});

	console.log('success loading Unsub model');
	return Unsub;
});
