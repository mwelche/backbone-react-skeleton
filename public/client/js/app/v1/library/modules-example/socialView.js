//js/modules/socialView.js

define(['marionette'], function(Marionette) {
	var Social = {};
	
	// Social Sign In view
	Social.View = Marionette.ItemView.extend({
		initialize: function(options) {
			this.model = options.model;
			this.data = options.data;
		},
		events: {
			"click .facebook-social-login": "facebook",
			"click .google-social-login": "google"
		},
		facebook: function(e) {
			e.preventDefault();
			this.saveSearchFields();
			window.location.href = location.protocol + "//api." + location.hostname + "/server/auth/facebook";
		},
		google: function(e) {
			e.preventDefault();
			this.saveSearchFields();
			window.location.href = location.protocol + "//api." + location.hostname + "/server/auth/google";
		},
		saveSearchFields: function() {
			if (this.model.get('keyword') !== '' && this.model.get('location') !== '') {
				$.cookie('search_k', this.model.get('keyword'), { expires: 1, path: '/' });
				$.cookie('search_l', this.model.get('location'), { expires: 1, path: '/' });
			}
			if (typeof this.data !== 'undefined') {
				console.log('data passed as defined');
				if (this.data.hasOwnProperty("keyword") && this.data.hasOwnProperty("location")) {
					$.cookie('action', 'save-search', { expires: 1, path: '/' });
					console.log('action saved in cookie');
				}
			}
		}
	});

	return Social;
});
