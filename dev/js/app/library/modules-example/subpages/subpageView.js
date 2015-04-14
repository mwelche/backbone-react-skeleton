// js/modules/subpages/subpageView.js
define(['marionette', 'modules/validator', 'templates', 'modules/tooltip', 'sha512'], function(Marionette, Validator, templates, Tooltip) {
	var Sub = {};
	var handleKeys = function(e, that) {
		if (e.keyCode !== 13) { return; }
		// Calls initvalidation function within view.
		that.initValidation();
	};
	// adds a tooltip showing the placeholder on the input when val!=='' and the placeholder is no longer visible.
	var placeholderTooltip = function(e) {
		var element, placeholder;
		if (e.target) {
			element = e.target;
		} else {
			element = e;
		}
		if ($(element).attr('placeholder') !== undefined) {
			placeholder = $(element).attr('placeholder');
		} else if ($(element).find('option').eq(0).text() !== undefined) {
			placeholder = $(element).find('option').eq(0).text();
		}
		var id = $(element).attr('id') + '_ph';
		if ($(element).val() !== '' && $(element).val() !== undefined) {
			if ($('#'+id).length === 0) {
				$(element).after(function() {
					return '<span id="'+id+'" class="placeholder-tooltip">' + placeholder + '</span>';
				});
				setTimeout(function() {
					$('#'+id).addClass('active');
				},0);
			}
		} else {
			$('#'+id).removeClass('active');
			setTimeout(function() {
				$('#'+id).remove();
			},200);
		}
	};
	var ajaxJsonp = function(url, data) {
		return $.jsonp({
			url: url,
			callbackParameter: "callback",
			data: data
		});
	};

	// About view
	Sub.GettingstartedView = Marionette.ItemView.extend({
		template: templates.gettingStarted,
		tagName: 'div',
		className: 'subpage'
	});

	// Privacy Policy view
	Sub.PrivacyView = Marionette.ItemView.extend({
		template: templates.privacy,
		tagName: 'div',
		className: 'subpage'
	});

	// Manage Subscriptions view
	Sub.ManageSubscriptionsView = Marionette.ItemView.extend({
		initialize: function(options) {
			this.app = options.app;
			this.model = options.model;
			this.email = options.email || 1;
			this.userModel = options.userModel;
		},
		getTemplate: function() {
			if (this.email !== 1) {
				return templates.unsubscribed;
			} else {
				return templates.manageSubscriptions;
			}
		},
		tagName: 'div',
		className: 'subpage',
		events: {
			"click .registration .submit": "initValidation",
			"keyup": function(e) {
				handleKeys(e, this);
				placeholderTooltip(e);
			}
		},
		onRender: function() {
			if (this.userModel.get('email') && this.email === 1) {
				this.$('#reg_email').val(this.userModel.get('email'));
			}
		},
		onShow: function() {
			console.log("onshow email:", this.email);
			var unsub = this.model,
				user_email = this.email,
				url = location.protocol + "//api." + location.hostname + "/server/unsubscribe/",
				data = {
					user_email:user_email,
					partner: (unsub.get("partner") || " "),
                    source:(unsub.get("source") || " "),
                    sub_id:(unsub.get("sub_id") || " "),
				},
				App = this.app,
				that = this;
			if (this.email !== 1) {
				console.log(unsub);
				$('#unsub-email').html(user_email);
				// Send unsub email address to server
				$.when(ajaxJsonp(url, data)).done(function (result) {
					if (jQuery.isEmptyObject(result)) {
						console.log("no user found:" + user_email);
					} else {
						// set the unsub model
						unsub.set({
							site_id: 7,
							email: user_email,
							partner: result.Partner,
							source: result.Source,
						});
					}
					var url = location.protocol + "//api." + location.hostname + "/bacon/api/v1/create_unsub",
						data = {
							site_id: unsub.get("site_id"),
							email: unsub.get("email"),
							partner: (unsub.get("partner") || " "),
							source:(unsub.get("source") || " "),
							sub_id:(unsub.get("sub_id") || " "),
							details: (unsub.get("details") || " ")
						};
					console.log("unsubscribe:" + unsub);
					// Added to bacon unsubscribe
					$.when(ajaxJsonp(url, data)).done(function (result) {
						console.log('Success:', result);
					}).fail(function (xOptions, textStatus) {
						console.log('unsub error');
						console.log(textStatus);
					});
				}).fail(function (xOptions, textStatus) {
					that.$('#unsub-error').show();
					that.$('#unsubbed').hide();
					console.log('unsub error');
					console.log(textStatus);
				});
			}
			// ie8 placeholder polyfill
			$('input').placeholder();
		},
		initValidation: function() {
			var isValid = true,
				validation = [],
				unsub_email = $.trim($('#reg_email').val());

			this.$("#reg_email").removeClass('error');
			$("div.error").remove();
			isValid = Validator.email('#reg_email');
			console.log('submitting usnsub email', unsub_email);
			console.log("is valid:", isValid);

			if (isValid) { this.submitUnsubscribe(unsub_email); }
		},
		submitUnsubscribe: function(unsub_email) {
			var App = this.app,
				unsub = this.model;

			unsub.set({
				site_id: 7,
				email: unsub_email,
				details: "Manually added from Manage Subscriptions on the site"
			});

			return App.navigate("unsubscribe/" + unsub_email, {trigger: true});
		}
	});

	// Contact view
	Sub.ContactView = Marionette.ItemView.extend({
		template: templates.contact,
		tagName: 'div',
		className: 'subpage',
		events: {
			"click .registration button": "initValidation",
			"keyup input": function(e) {
				handleKeys(e, this);
				placeholderTooltip(e);
			}
		},
		onRender: function() {
			this.$('input, textarea').each(function(i, element) {
				placeholderTooltip(element);
			});
			// ie8 placeholder polyfill
			this.$('input').placeholder();
		},
		initValidation: function() {
			var isValid = true,
				validation = [],
				contact_name = $.trim($('#contact_name').val()),
				contact_email = $.trim($('#contact_email').val()),
				contact_message = $.trim($('#contact_message').val());

			$(".registration input").removeClass('error');
			$(".registration textarea").removeClass('error');
			$("div.error").remove();
			validation.push(Validator.isEmpty(contact_name, "#contact_name", "Name"));
			validation.push(Validator.email('#contact_email'));
			validation.push(Validator.isEmpty(contact_message, "#contact_message", "message"));
			console.log('submitting contact email', contact_email);
			isValid = validation.every(function(val, i) {
				if (val === false) {
					return false;
				}
				return true;
			});
			console.log("is valid:", isValid);
			if (isValid) { this.submitContact(contact_name, contact_email, contact_message); }
		},
		submitContact: function(name, email, message) {
			var url = location.protocol + "//api." + location.hostname + "/mail/sendgrid/",
				data = {
					recp: 'mail@careeralerts.com',
					frem: email,
					frnm: name,
					msg: message
				},
				that = this;
			$.when(ajaxJsonp(url, data)).done(function (result) {
				Tooltip.show("Thanks! You're message has been sent.");
				that.$('.contact').remove();
				if ($(document).width() > 768) {
					that.$('.contact-submitted').css('display', 'inline-block');
				} else {
					that.$('.contact-submitted').show();
				}
				console.log("Submit contact:", name, email, message);
			}).fail(function (xOptions, textStatus) {
				Tooltip.show("Sorry! There's a problem on our side, please try again later.");
				console.log('Failed to send contact us email');
			});
		}
	});

	// Contact view
	Sub.NotFoundView = Marionette.ItemView.extend({
		template: templates.notFound,
		tagName: 'div',
		className: 'notfound'
	});

	console.log('success loading Subpage Views');
	return Sub;
});
