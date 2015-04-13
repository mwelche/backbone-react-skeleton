//js/modules/modaloverlay/modalView.js

define(['marionette', 'templates', 'modules/validator', 'modules/tooltip', 'sha512'], function(Marionette, templates, Validator, Tooltip) {
	var isMobile = false,
		Modal = {};
	var ajaxJsonp = function(url, data) {
		return $.jsonp({
			url: url,
			callbackParameter: "callback",
			data: data
		});
	};
	if (window.navigator) {
		isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|Windows Phone|BlackBerry|Mobile)/);
	}
	if (isMobile) {
		Modal = {
			hideBody: function() {
				$('.wrapper').addClass('show-modal');
			},
			showBody: function() {
				$('.wrapper').removeClass('show-modal');
			}
		};
	}

	Modal.View = Marionette.ItemView.extend({
		initialize: function(options) {
			this.userModel = options.userModel;
			this.app = options.app;
			this.user_id = this.userModel.get("_id");
		},
		className: "modal-window",
		template: templates.loginModal,
		onShow: function() {
			$(this.$el).addClass('open');
		},
		onBeforeClose:function() {
			$(this.$el).removeClass('open');
		}
	});
	Modal.LoginView = Marionette.ItemView.extend({
		initialize: function(options) {
			this.userModel = options.userModel;
			this.app = options.app;
			this.user_id = this.userModel.get("_id");
			this.searchModel = options.searchModel;
			this.count = 0;
			this.data = options.data;
		},
		className: "modal-window",
		template: templates.loginModal,
		events: {
			"click #sign-in": "initValidation",
			"click .modal-close": "handleClose",
			"click .modal-login-register a": "handleClose",
			"click .forgot-password a": "handleClose",
			"keyup": "handleKeys"
		},
		onShow: function() {
			$(this.$el).addClass('open');
			if (isMobile) {
				Modal.hideBody();
			}
		},
		onBeforeClose:function() {
			$(this.$el).removeClass('open');
			if (isMobile) {
				Modal.showBody();
			}
		},
		handleKeys: function(e) {
			if (e.keyCode !== 13) {
				return;
			}
			this.initValidation();
		},
		handleClose: function(e) {
			if ($(e.currentTarget).attr('href') === '#') {
				e.preventDefault();
			}
			this.close();
		},
		submitLogin: function(login, pass) {
			var login_email = login,
				login_password = pass,
				url = location.protocol + "//api." + location.hostname + "/server/login1/",
				data = { email:login_email },
				that = this,
				App = this.app;
			$('.error-block').hide();
			$.when(ajaxJsonp(url, data)).done(function (result) {
				//alert("success");
				if (jQuery.isEmptyObject(result)) {
					console.log("no user found");
					that.error();
				} else {
					console.log("login: " + result[0].Email);
					console.log("salt: " + result[0].Domain);
					var myText = result[0].DateCreated + login_password + result[0].Domain + result[0]._id,
						shaObj = new jsSHA(myText, "ASCII"),
						hash = shaObj.getHash("SHA-512", "HEX"),
						url = location.protocol + "//api." + location.hostname + "/server/login2/",
						data = {
							email:login_email,
							hash:hash
						};
					$.when(ajaxJsonp(url, data)).done(function (result) {
						//alert("success");
						if (jQuery.isEmptyObject(result)) {
							console.log("no user found");
							that.error();
						} else {
							console.log("login: " + result.Email);
							that.userModel.save({
								_id: result._id,
								email: result.Email,
								type: result.Type,
								fname: result.FName,
								lname: result.LName,
								city: result.City,
								state: result.State,
								zip: result.Zip,
								partner: result.Partner,
								source: result.Source,
								token: result.Token,
								dateCreated: result.DateCreated,
								dateModified: result.DateModified,
								dateLastEngaged: result.DateLastEngaged
							}, {
								success: function() {
									Tooltip.show("Signed In as " + that.userModel.get("fname") + " " + that.userModel.get("lname"));
									if (that.searchModel.get('keyword') && that.searchModel.get('location')) {
										that.loginSaveSearch();
										App.navigate("jobs/"+that.searchModel.get('keyword').formatQuery()+"/"+that.searchModel.get('location').formatQuery(), {trigger: true});
									} else {
										App.navigate("home", {trigger: true});
									}
									that.close();
								},
								error: function() {
									console.log('error saving logged in user to model');
								}
							});
						}
					}).fail(function (xOptions, textStatus) {
						Tooltip.show("Sorry! There's a problem on our side, please try again later.");
						console.log('error with login2');
						console.log(textStatus);
					});
				}
			}).fail(function (xOptions, textStatus) {
				Tooltip.show("Sorry! There's a problem on our side, please try again later.");
				console.log('error with login1');
				console.log(textStatus);
			});
		},
		initValidation: function() {
			var isValid = true,
				validation = [],
				login_email = $.trim($('#login_email').val()),
				login_password = $.trim($('#login_password').val());

			$(".modal-login input").removeClass('error');
			$("div.error").remove();

			validation.push(Validator.email("#login_email"));
			validation.push(Validator.password("#login_password"));

			isValid = validation.every(function(val, i) {
				if (val === false) {
					return false;
				}
				return true;
			});
			console.log("is valid:", isValid);

			if (isValid) {
				this.submitLogin(login_email, login_password);
			}
		},
		error: function() {
			this.count++;
			if (this.count < 5) {
				$('.error-block').show();
				console.log(this.count);
			} else {
				this.fiveFailedAttempts();
			}
		},
		fiveFailedAttempts: function() {
			$('.error-block').html("<i class='ss-icon'>&#x26A0;</i> You've failed to log in five times. If you've forgotten your password, <a href='#forgot-password'>you may reset it here.</a>").show();
		},
		loginSaveSearch: function() {
			if (typeof this.data !== 'undefined') {
				console.log('data passed as defined');
				if (this.data.hasOwnProperty("keyword") && this.data.hasOwnProperty("location")) {
					$.cookie('action', 'save-search', { expires: 1, path: '/' });
					console.log('action saved in cookie');
				}
			}
		}
	});

	return Modal;
});
