define(function() {
	var Validator = {};
	Validator = {
		email: function(input) {
			// Validate email
			var email = $.trim($(input).val());
			var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			if (!regex.test(email)) {
				this.error(input, "Please enter a valid Email Address", false);
				return false;
			} else { return true; }
		},
		password: function(input) {
			// Validate password
			var password = $.trim($(input).val());
			if (password.length < 8) {
				this.error(input, "Your password must be at least 8 characters", false);
				return false;
			} else { return true; }
		},
		confirmPass: function() {
			// Validate confirm password
			var password = $.trim($('#reg_password').val()),
				confirmPassword = $.trim($('#reg_confirm_password').val());
			if (password !== confirmPassword) {
				this.error("#reg_confirm_password", "This password does not match", false);
				return false;
			} else { return true; }
		},
		state: function(state) {
			// Validate state
			if (state === "0") {
				this.error("#reg_state", "Please select a State", false);
				return false;
			} else { return true; }
		},
		zip: function(zip) {
			// Validate zip
			var regex = /^\d{5}$/;
			if (!regex.test(zip)) {
				this.error("#reg_zip", "Please enter a valid 5 digit Zip Code", false);
				return false;
			} else { return true; }
		},
		isEmpty: function(field, inputID, valString) {
			// Check if field is empty
			if (field === "") {
				this.error(inputID, "Please input a valid", valString);
				return false;
			} else { return true; }
		},
		error: function(input, textString, valString) {
			// Add error class to input and create new div after input with error text
			$(input).addClass('error').after(function() {
				if (valString !== false) {
					return "<div class='error'><span>" + textString + " " + valString + "</span></div>";
				} else {
					return "<div class='error'><span>" + textString + "</span></div>";
				}
			});
			setTimeout(function() {$('div.error').addClass('show');}, 0);
		}
	};

	return Validator;
});
