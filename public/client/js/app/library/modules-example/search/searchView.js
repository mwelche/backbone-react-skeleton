//js/modules/search/searchView.js

define(['marionette', 'modules/geolocate', 'autocomplete'], function(Marionette, Geo) {

	var Searchview = Searchview || {},
		isMobile = false;
	if (window.navigator) {
		isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|Windows Phone|BlackBerry|Mobile)/);
	}
	console.log('Search View loading');
	return Searchview = Marionette.ItemView.extend({
		initialize: function(options) {
			this.app = options.app;
			this.model = options.model;
			this.userModel = options.userModel;
			this.renderKeyword();
			this.renderLocation();
			// ie8 placeholder polyfill
			$('input').placeholder();
			console.log('THe CITY', this.userModel.get('city'));
			// Check location values before firing geolocation
			if ($('#l').val() === '') {
				var city = this.userModel.get("city"),
					state = this.userModel.get("state");
				if ((city !== undefined && city) && (state !== undefined && state)) {
					$('#l').val(city + ', ' + state);
					console.log('using user model for location');
				} else if ($.cookie('user_location') !== undefined) {
					$('#l').val($.cookie('user_location'));
					console.log('using cookie for location');
				} else if (this.userModel.get("zip")) {
					$('#l').val(this.userModel.get("zip"));
				} else {
					console.log('using geolocate for location');
					Geo.getUserLocation();
				}
			}
			this.autocomplete();
		},
		events: {
			"click #searchButton": "doSearch",
			"keyup": "handleKeys",
			"click .error": "errorClicked"
		},
		modelEvents: {
			"change:keyword": "renderKeyword",
			"change:location": "renderLocation"
		},
		setQuery: function(q, l) {
			this.model.set({
				keyword: q.toProperCase(),
				location: l.formatLocation()
			});
		},
		renderKeyword: function() {
			// Update Keyword
			this.$('#q').val(this.model.get('keyword'));
		},
		renderLocation: function() {
			// Update Location
			this.$('#l').val(this.model.get('location'));
		},
		handleKeys: function(e) {
			if (e.keyCode !== 13) {
				this.zipFormatting();
				return;
			}
			this.doSearch();
			this.$('.tt-suggestions').remove();
		},
		doSearch: function() {
			var queryUrl = '',
				q = $('#q').val(),
				l = $('#l').val();
			if (this.isEmpty()) {
				this.error();
				return false;
			} else {
				this.setQuery(q, l);
				this.zipFormatting();
				console.log('q value:', q);
				console.log('l value:', l);

				if (this.model.get('radius') !== this.model.defaults.radius || this.model.get('daysBack') !== this.model.defaults.radius) {
					queryUrl = 'jobs/' + q.formatQuery() + '/' + l.formatQuery() + '/1/' + this.model.get('radius') + '/' + this.model.get('daysBack');
				} else if (this.l !== "_" && this.q !== "_") {
					queryUrl = 'jobs/' + q.formatQuery() + '/' + l.formatQuery();
				} else if (this.l !== "_") {
					queryUrl = 'jobs/' + q.formatQuery();
				} else {
					queryUrl = 'jobs';
				}
				this.app.navigate(queryUrl, {trigger:true});
			}
		},
		autocomplete: function() {
			this.$('#q.typeahead').typeahead({
				hint: false,
				highlight: true,
				minLength: 2
			},
			{
				name: 'keywords',
				displayKey: 'value',
				// `ttAdapter` wraps the suggestion engine in an adapter that
				// is compatible with the typeahead jQuery plugin
				source: keywords.ttAdapter(),
				templates: {
					suggestion: function(d) {
						return '<p class="needsclick">'+d.value+'</p>';
					}
				}
			});
			this.$('#l.typeahead').typeahead({
				hint: false,
				highlight: true,
				minLength: 2
			},
			{
				name: 'states',
				displayKey: 'value',
				// `ttAdapter` wraps the suggestion engine in an adapter that
				// is compatible with the typeahead jQuery plugin
				source: states.ttAdapter(),
				templates: {
					suggestion: function(d) {
						return '<p class="needsclick">'+d.value+'</p>';
					}
				}
			});
		},
		zipFormatting: function() {
			// update location
			var that = this,
				regex = /^\d{5}$/,
				location = $.trim(this.$('#l').val());
			if (regex.test(location)) {
				var zip = location;
				$.ajax({
					url: "http://zip.elevenbasetwo.com",
					cache: false,
					dataType: "json",
					type: "GET",
					data: "zip=" + zip,
					success: function(result, success) {
						var formatted = result.city.toProperCase()+ ', ' +result.state+ ' ' +zip
						that.model.set({location: formatted});
					},
					error: function(result, success) {
						console.log('There was an error with the Zip code lookup');
						return false;
					}
				});
			}
		},
		isEmpty: function() {
			this.$('.error').remove();
			if ($.trim(this.$('#q').val()).formatQuery() === '_' || $.trim(this.$('#l').val()).formatQuery() === '_') {
				return true;
			} else {
				return false;
			}
		},
		error: function() {
			if ($.trim(this.$('#q').val()).formatQuery() === '_') {
				this.$('#q').after(function() {
					return "<div class='error'>A Job Title, Skill, or Keyword is required.</div>"
				});
			}
			if ($.trim(this.$('#l').val()).formatQuery() === '_') {
				this.$('#l').after(function() {
					return "<div class='error'>A City, State, and/or Zip is required.</div>"
				});
			}
			setTimeout(function() {
				this.$('.error').addClass('active');
			},0);
		},
		errorClicked: function(e) {
			$(e.target).prev().focus();
			$(e.target).removeClass('active');
		}
	});
});
