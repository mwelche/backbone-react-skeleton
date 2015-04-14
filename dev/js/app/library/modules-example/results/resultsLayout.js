// js/modules/results/resultsLayout.js
define(['marionette', 'modules/results/resultsView', 'templates', 'sha1'], function(Marionette, SubApp, templates) {
	//Results Page Layout
	var isMobile = false;
	if (window.navigator) {
		isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|Windows Phone|BlackBerry|Mobile)/);
	}
	SubApp.ResultsPageLayout = Marionette.Layout.extend({
		initialize: function(options) {
			this.model = options.model;
			this.userModel = options.userModel;
			if (this.userModel.get('email')) {
				var email = this.userModel.get('email');
				this.userModel.set({
					sha1hash: CryptoJS.SHA1(email)
				});
				console.log('THE SHA1 HASH:', this.userModel.get('sha1hash'));
			}
		},
		template: templates.resultsLayout,
		className: 'container resultsLayout',
		regions: {
			left: '#side-nav',
			middle: '#jobResultsContent',
			resultsCount: '#resultsCount',
			alerts: '#alerts',
			pagination: '#resultPagination',
		},
		modelEvents: {
			"change:keyword":"keywordChanged",
			"change:location":"locationChanged"
		},
		events: {
			'click .navicon':'showMobileNav'
		},
		keywordChanged: function() {
			this.$('.right-kw').html(this.model.get('keyword').toProperCase());
		},
		locationChanged: function() {
			var location = (this.model.get('location') === '') ? 'you' : this.model.get('location').split(',')[0].formatLocation();
			this.$('.right-loc').html(location);
		},
		showMobileNav: function() {
			$(".primary-nav").toggleClass("active");
		},
		onBeforeRender: function() {
			var that = this;
			// Connect to server to get encryptedEmail and iv
			if (this.userModel.get('_id')) {
				$.jsonp({
					url: location.protocol + "//api." + location.hostname + "/metrics/encryptEmail/",
					callbackParameter: "callback",
					data: {
						user_id:this.userModel.get('_id'), // 0 or string
					},
					success: function(result) {
						console.log('encryptedEmail', result);
						that.userModel.set({
							encryptedEmail: result.encryptedEmail,
							iv: result.iv
						});
						that.$('#liveramp').html(
							'<iframe id="liveramp" name="_rlcdn" width=0 height=0 frameborder=0 src="http://ei.rlcdn.com/381899.html?xs='
							+that.userModel.get('encryptedEmail')
							+'&c=bf-cbc&v='
							+that.userModel.get('iv')
							+'"></iframe>'
						);
					},
					error: function(xOptions, textStatus){
						console.log("encryptEmail function error");
					}
				});
			} else {
				this.$('#liveramp').html('<iframe id="liveramp" name="_rlcdn" width=0 height=0 frameborder=0 src="http://rc.rlcdn.com/381899.html"></iframe>');
			}
		},
		onRender: function() {
			if (this.userModel.get('_id')) {
				this.$('.sidebar-cta').hide();
			} else {
				this.$('.sidebar-cta').show();
			}
			this.keywordChanged();
			this.locationChanged();
			if (this.isFirstTime() && this.userModel.get('type') === 'confirmed') {
				this.firstTimeOverlay();
			}
		},
		onShow: function() {
			var retina = window.devicePixelRatio > 1;
			if (retina) {
				this.$('.logo img').attr('src', 'images/logoresult@2x.png');
			}
		},
		isFirstTime: function() {
			return (this.model.get('firstTime')) ? true : false;
		},
		firstTimeOverlay: function() {
			var that = this;
			if (isMobile && $(window).width() < 960) {
				this.$('#overlay-mobile').addClass('active');
			} else {
				this.$('#overlay-desktop').addClass('active');
			}
			this.$('.overlay-close').on('click', function() {
				$('.overlay-content').removeClass('active').delay(0).remove();
				that.model.set({
					firstTime: false
				});
			});
		}
	});
	console.log('Results layout successfully loaded');
	return SubApp;
});
