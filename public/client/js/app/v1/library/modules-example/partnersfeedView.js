//js/modules/partnersfeedView.js

define(['marionette', 'templates',], function(Marionette, templates) {
	var Partnersfeed = {};

	Partnersfeed.View = Marionette.ItemView.extend({
		initialize: function(options) {
			this.result = this.options.result;
		},
		template: templates.partnersfeed,
		onShow: function() {
			this.$('.result').text(this.result);
		}
	});

	return Partnersfeed;
});
