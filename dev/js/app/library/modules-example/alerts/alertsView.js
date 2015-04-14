// js/modules/alerts/alertsView.js

define(['marionette', 'modules/loading', 'templates', 'modules/tooltip', 'autocomplete'], function(Marionette, Loading, templates, Tooltip) {
	var Alerts = {},
		isMobile = false;
	if (window.navigator) {
		isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|Windows Phone|BlackBerry|Mobile)/);
	}
	function isEmpty(value) {
		return (value === '') ? true : false;
	};

	// Alerts Module View
	Alerts.Layout = Marionette.Layout.extend({
		template: templates.alertsLayout,
		className: "subpage",
		regions: {
			middle: "#alertContent"
		}
	});

	// Single Alert View
	Alerts.SingleAlert = Marionette.ItemView.extend({
		initialize: function(options) {
			this.app = options.app;
			this.userModel = options.userModel;
			this.user_id = options.userModel.get("_id");
		},
		template: templates.alert,
		className: "module",
		events: {
			"click .actions .alert-on-off": "toggleAlert",
			"click .actions .edit": "editAlert",
			"click .actions .submit": "submitAlert",
			"click .actions .delete": "deleteAlert",
			"click .actions .doSearch": "doSearch",
			"click .frequency-title": "toggleFrequencyDropdown",
			"click .frequency-back": "backToFrequencyType",
			"click .freq-option": "selectFreq",
			"click .freq-weekly": "showDays",
			"click .freq-day": "selectDay"
		},
		modelEvents: {
			"change:keyword": "modelChanged",
			"change:location": "modelChanged",
			"change:frequency": "modelChanged"
		},
		modelChanged: function() {
			this.render();
		},
		onRender: function() {
			var that = this,
				regex = /^\d{5}$/,
				locationVal = this.$('.location input').val();
			// Update the keyword with a properly formatted string
			this.$('.title input').val(function() {
				return $(this).val().toProperCase();
			});

			// ie8 placeholder polyfill
			this.$('input').placeholder();

			// Properly Format Location
			// If the location is a zip code, do the zip code lookup
			if (regex.test(locationVal)) {
				var zip = locationVal;
				console.log('CHECKING ZIP:', locationVal);
				$.ajax({
					url: "http://zip.elevenbasetwo.com",
					cache: false,
					dataType: "json",
					type: "GET",
					data: "zip=" + zip,
					success: function(result, success) {
						var formatted = result.city.toProperCase()+ ', ' +result.state+ ' ' +zip
						console.log(formatted);
						that.model.save({
							location: formatted,
							user_id:this.user_id
						});
					},
					error: function(result, success) {
						console.log('There was an error with the Zip code lookup');
					}
				});
			} else {
				// If the location isn't a zip code, only format the string.
				this.$('.location input').val(function() {
					return $(this).val().formatLocation();
				});
			}
			// Set autocomplete on render;
			this.autocomplete();
			this.tooltip();
		},
		toggleAlert: function(e) {
			e.preventDefault();
			if (!this.model.get('active')) {
				console.log('On');
				$(e.currentTarget).removeClass('inactive').html('<i class="ss-icon">&#x1F514;</i>');
				this.model.set({active:true});
			} else {
				console.log('Off');
				$(e.currentTarget).addClass('inactive').html('<i class="ss-icon">&#x1F515;</i>');
				this.model.set({active:false});
			}
			this.model.save({
				user_id:this.user_id
			});
		},
		editAlert: function(e) {
			e.preventDefault();
			// enable editing the input box
			this.$('input').prop('disabled', false);
			$(e.currentTarget).removeClass('edit').addClass('submit').html('<i class="ss-icon">&#x2713;</i>').prev().attr('title', 'Submit').html('Submit');
			this.$('a.delete').prev().attr('title', 'Cancel').html('Cancel');
			// Add inactive class to create new alert button so no alerts can be created while editing.
			$('#createAlert').addClass('inactive');
			this.$('.title .tt-input').focus();
			$('.module').addClass('edit-mode');
			$(this.$el).addClass('editing');
			Tooltip.show("Edit Alert");
		},
		submitAlert: function(e) {
			e.preventDefault();
			var keyword = $.trim(this.$('.title input').val()),
				location = $.trim(this.$('.location input').val()),
				that = this;
			if (this.isValid(keyword, location)) {
				this.$('.location').removeClass('required');
				this.$('.title').removeClass('required');
				this.handleEditEnd();
				this.model.save({
					keyword: keyword,
					location: location,
					user_id:this.user_id
				}, {
					success: function(model, result) {
						that.modelSaveCallback(result);
					}
				});
			} else {
				Tooltip.show("A keyword and location is required to save an alert");
				return false;
			}
		},
		isValid: function(keyword, location) {
			var valid = true;
			if (isEmpty(keyword)) {
				this.$('.title').addClass('required');
				valid = false;
			}
			if (isEmpty(location)) {
				this.$('.location').addClass('required');
				valid = false;
			}
			return valid;
		},
		cancelEdit: function() {
			this.handleEditEnd();
			this.render();
			Tooltip.show("Cancelled Edit");
		},
		handleEditEnd: function() {
			// disable editing the input box
			this.$('input').prop('disabled', true);
			// Re-adds the edit class and replaces check with pen icon, then changes the text of the tooltip.
			this.$('a.submit').removeClass('submit').addClass('edit').html('<i class="ss-icon">&#x270E;</i>').prev().attr('title', 'Edit').html('Edit');
			this.$('a.delete').prev().attr('title', 'Delete').html('Delete');
			// Check whether to disable edit mode or not
			this.disableEditModeCheck();
			// Removes the class that adds opacity to the alert being edited.
			$(this.$el).removeClass('editing');
		},
		deleteAlert: function(e) {
			e.preventDefault();
			if ($(this.$el).hasClass('editing')) {
				this.cancelEdit();
			} else {
				console.log(this.model);
				// DELETING MODEL FROM SERVER
				this.model.destroy({
					data: {user_id:this.user_id},
					processData: true
				});
				// Check whether to disable edit mode or not
				this.disableEditModeCheck();
				Tooltip.show("Alert Deleted");
			}
		},
		disableEditModeCheck: function() {
			// If there are no longer any modules that are being edited....
			if (!$('.module .actions a').hasClass('submit')) {
				// remove inactive class from create button.
				$('#createAlert').removeClass('inactive');
				// remove 'edit state' from all modules
				$('.module').removeClass('edit-mode');
			}
		},
		doSearch: function(e) {
			e.preventDefault();
			var that = this,
				q = this.model.get('keyword').formatQuery(),
				l = this.model.get('location').formatQuery(),
				d = (function() {
					var frequency = that.model.get('frequency').type.toLowerCase();
					if (frequency === 'daily') { return 1; }
					else if (frequency === 'weekly') { return 7; }
					else if (frequency === 'monthly') { return 30; }
				})();
			this.app.navigate('jobs/' + q + '/' + l + '/1/25/' + d, {trigger:true});
		},
		toggleFrequencyDropdown: function(e) {
			var that = this;
			if (this.userModel.get("type") === "confirmed") {

			} else {
				this.$('.frequency-dropdown').toggleClass('active');
				if (this.$('.frequency-weekday-dropdown').hasClass('active')) {
					this.$('.frequency-weekday-dropdown').removeClass('active');
				}
				e.stopPropagation();
				$(document).click(function(e) {
					var container = that.$(".frequency");
					if (!container.is(e.target) && // if the target of the click isn't the container...
						container.has(e.target).length === 0) // ... nor a descendant of the container
					{
						that.$('.frequency-dropdown, .frequency-weekday-dropdown').removeClass('active');
					}
				});
			}
		},
		backToFrequencyType: function() {
			this.$('.frequency-weekday-dropdown').removeClass('active');
		},
		selectFreq: function(e) {
			var type = $.trim($(e.currentTarget).text()),
				that = this;
			console.log(type);
			this.model.save({
				frequency: {
					type: type
				},
				user_id:this.user_id
			}, {success:function(model, result) {
					that.modelSaveCallback(result);
				}
			});
			this.$('.frequency-dropdown').removeClass('active');
			this.$('.freq-value').text(type);
		},
		showDays: function(e) {
			this.$('.frequency-weekday-dropdown').addClass('active');
		},
		selectDay: function(e) {
			var day = $.trim($(e.currentTarget).text()),
				type = 'Weekly',
				that = this;
			this.model.save({
				frequency: {
					type: type,
					weekday: day
				},
				user_id:this.user_id
			}, {success:function(model, result) {
					that.modelSaveCallback(result);
				}
			});
			this.$('.frequency-dropdown, .frequency-weekday-dropdown').removeClass('active');
		},
		modelSaveCallback: function(result) {
			if (result.isSame) {
				Tooltip.show("Oops, the Alert you're trying to create already exists.");
				this.$('.alert-dup-error').show();
			} else if (result.error) {
				Tooltip.show(result.error);
			} else {
				Tooltip.show("Alert saved successfully!");
				this.$('.alert-dup-error').hide();
			}
		},
		autocomplete: function() {
			// Autocomplete on the Keyword and Location fields.
			this.$('.title .typeahead').typeahead({
				hint: false,
				highlight: true,
				minLength: 2
			}, {
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
			this.$('.location .typeahead').typeahead({
				hint: false,
				highlight: true,
				minLength: 2
			}, {
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
		tooltip: function() {
			if (!isMobile) {
				// Set the tooltip on hover event
				this.$('.actions li').hover(function() {
					$(this).find('.alerts-tooltip').addClass('active');
				}, function() {
					$(this).find('.alerts-tooltip').removeClass('active');
				});
			}
		}
	});

	// Alerts Collection View
	Alerts.AlertsView = Marionette.CollectionView.extend({
		initialize: function(options) {
			this.app = options.app;
			this.userModel = options.userModel;
			this.user_id = options.userModel.get("_id");
			this.collection.fetch({
				reset: true,
				data: $.param({user_id:this.user_id})
			});
		},
		emptyView: Loading.View,
		itemView: Alerts.SingleAlert,
		itemViewOptions: function() {
			return {
				app: this.app,
				userModel: this.userModel
			};
		},
		tagName: "section",
		className: "my-alerts",
		collectionEvents: {
			"change:active": "collectionChanged",
			"add": "collectionAddRemove",
			"remove": "collectionAddRemove"
		},
		appendHtml: function(collectionView, itemView){
			collectionView.$el.prepend(itemView.el);
		},
		collectionChanged: function() {
			this.render();
			this.triggerAlerts();
			// remove inactive class on re-render since 'edit mode' is no longer active
			$('#createAlert').removeClass('inactive');
		},
		collectionAddRemove: function() {
			this.triggerAlerts();
			if (this.collection.length === 0) {
				$('#createAlert').removeClass('inactive');
			}
		},
		onRender:function() {
			this.triggerAlerts();
		},
		triggerAlerts: function() {
			var active = true;
			_.each(this.collection, function(element, i, list) {
				// check if there are any modules with inactive alerts
				if (!list.models[i].attributes.active) {
					// if so, set active as false
					active = false;
				}
			});
			if (this.collection.length === 0) { active = false; }
			console.log(active);
			if (active) {
				$('#triggerAlerts').addClass('active');
			} else {
				if (!$('#triggerAlerts').hasClass('active')) {
					$('#triggerAlerts i').html('&#x1F514;');
				}
				$('#triggerAlerts').removeClass('active');
				$('#triggerAlerts i').html('&#x1F514;');
			}
		}
	});

	Alerts.FilterView = Marionette.ItemView.extend({
		initialize: function(options) {
			this.app = options.app;
			this.collection = options.collection;
			this.userModel = options.userModel;
			this.searchModel = options.searchModel;
			this.user_id = this.userModel.get("_id");
		},
		events: {
			"click #createAlert": "createAlert",
			// "click #sortAlerts": "sortAlerts",
			"click #triggerAlerts": "triggerAlertsOnOff"
		},
		createAlert: function(e) {
			if (!$(e.currentTarget).hasClass('inactive')) {
				var that = this,
					alert = Alerts.SingleAlert,
					collection = this.collection,
					data = {
						action: "create-alert",
						view: "alerts"
					};
				if (!this.userModel.get("token")) {
					if (collection.length < 1) {
						console.log('ADDING AS A CONFIRMED');
						this.addToCollection(collection, alert);
					} else {
						require(['modules/modaloverlay/modalView', 'modules/socialView'], function(Modal, Social) {
							var modal = new Modal.LoginView({
								userModel: that.userModel,
								app: that.app,
								searchModel: that.searchModel,
								data: data
							});
							that.app.modal.show(modal);
							new Social.View({
								el: "#socialModal",
								model: that.searchModel,
								data: data
							});
						});
					}
				} else {
					if (collection.length < 25) {
						console.log('ADDING AS A CONFIRMED +');
						this.addToCollection(collection, alert);
					} else {
						Tooltip.show("You've reached the 25 Alert Limit.");
					}
				}
			}
		},
		addToCollection: function(collection, alert) {
			Tooltip.show("Alert Created");
			collection.add(alert);
			$('.module').eq(0).find('.edit').trigger('click');
		},
		sortAlerts: function() {
			// TODO
		},
		triggerAlertsOnOff: function(e) {
			var user_id = this.user_id;
			if ($(e.currentTarget).hasClass('active')) {
				// iterate through the collection using underscore method. list.models[i] is the reference to the model.
				_.each(this.collection, function(element, i, list) {
					list.models[i].set({active:false});
					list.models[i].trigger('change:active');
					list.models[i].save({
						user_id:user_id
					});
				});
				$(e.currentTarget).removeClass('active').html('<i class="ss-icon">&#x1F515;</i> Toggle All');
				Tooltip.show("<i class='ss-icon'>&#x1F515;</i> Turned All Alerts Off");
			} else {
				_.each(this.collection, function(element, i, list) {
					list.models[i].set({active:true});
					list.models[i].trigger('change:active');
					list.models[i].save({
						user_id:user_id
					});
				});
				$(e.currentTarget).addClass('active').html('<i class="ss-icon">&#x1F514;</i> Toggle All');
				Tooltip.show("<i class='ss-icon'>&#x1F514;</i> Turned All Alerts On");
			}
		}
	});

	console.log('success loading Alerts Views');
	return Alerts;
});
