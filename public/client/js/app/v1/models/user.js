// js/modules/models/user.js

console.log('user.js loaded.');
define(["marionette", "localStorage"], function(Marionette) {
	var User = User || {};

	User.Model = Backbone.Model.extend({
		//default attributes of a job
		defaults: {
			// User
			_id: '', // MongoDB ObjectId,
			email: '',
			type: '', // coreg, pending, confirmed, local, facebook, twitter, google, linkedin
			fname: '',
			lname: '',
			city: '',
			state: '',
			zip: '',
			partner: '',
			source: '',
			token: '',
			dateCreated: '',
			dateModified: '',
			dateLastEngaged: '',
			mobileDigest: true
		},
		localStorage: new Backbone.LocalStorage("user")
	});

	console.log('success loading user model');

	return User;
});
