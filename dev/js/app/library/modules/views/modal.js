//js/modules/modalView.js

define(['marionette', 'templateConfig', 'modules/validator', 'modules/tooltip'], function(Marionette, templates, Validator, Tooltip) {
	var Modal = {};
	
	Modal.View = Marionette.ItemView.extend({
		initialize: function(options) {
			this.userModel = this.options.userModel;
			this.app = this.options.app;
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
			this.userModel = this.options.userModel;
			this.app = this.options.app;
			this.user_id = this.userModel.get("_id");
		},
		className: "modal-window",
		template: templates.loginModal,
		events: {
			"click #sign-in": "initValidation",
			"click .modal-close": "handleClose",
			"click .unreg-side-register a": "handleClose",
			"click .forgot-password a": "handleClose",
			"keyup": "handleKeys"
		},
		onShow: function() {
			$(this.$el).addClass('open');
		},
		onBeforeClose:function() {
			$(this.$el).removeClass('open');
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
				that = this,
				App = this.app;
			$('.error-block').hide();
			Backbone.ajax({
				url: location.protocol + "//api." + location.hostname + "/server/login1/",
				dataType: "jsonp",
				data: {
					email:login_email
				},
				success: function(result){
					//alert("success");
					if (jQuery.isEmptyObject(result)) {
						console.log("no user found");
						that.error();
					} else {
						console.log("login: " + result[0].Email);
						console.log("salt: " + result[0].Domain);
						var myText = result[0].DateCreated + login_password + result[0].Domain + result[0]._id;
						var shaObj = new jsSHA(myText, "ASCII");
						var hash = shaObj.getHash("SHA-512", "HEX");
						Backbone.ajax({
							url: location.protocol + "//api." + location.hostname + "/server/login2/",
							dataType: "jsonp",
							data: {
								email:login_email,
								hash:hash
							},
							success: function(result){
								//alert("success");
								if (jQuery.isEmptyObject(result)) {
									console.log("no user found");
									that.error();
								} else {
									console.log("login: " + result.Email);
									that.model.save({
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
											Tooltip.show("Signed In as " + that.model.get("fname") + " " + that.model.get("lname"));
											var city = that.model.get("city"),
												state = that.model.get("state"),
												zip = that.model.get("zip");
											if ((city !== '') && (state !== '')) {
												App.navigate("jobs/_/" + city.replace(/ /g,"-") + "-" + state, {trigger: true});
											} else if (zip !== '') {
												App.navigate("jobs/_/" + zip, {trigger: true});
											} else {
												App.navigate("account", {trigger: true});
											}
											that.close();
										},
										error: function() {
											console.log('error saving logged in user to model');
										}
									});
								}
							},
							error: function(jqXHR, textStatus, errorThrown){
								alert("error");
								console.log(jqXHR.status);
								console.log(jqXHR.responseText);
								console.log(textStatus);
							}
						});
					}
				},
				error: function(jqXHR, textStatus, errorThrown){
					alert("error");
					console.log(jqXHR.status);
					console.log(jqXHR.responseText);
					console.log(textStatus);
				}
			});
		},
		initValidation: function() {
			var isValid = true,
				validation = [],
				login_email = $.trim($('#login_email').val()),
				login_password = $.trim($('#login_password').val());

			$(".unreg-side input").removeClass('error');
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
		}
	});

	return Modal;
});
