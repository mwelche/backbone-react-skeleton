// js/modules/homePage/homeLayout.js
define(['marionette', 'modules/home/homeView', 'templates'], function(Marionette, SubApp, templates) {
	//Home Page Layout
	var titleslide = function() {
		var windowScroll = $(this).scrollTop();
		$('.home-header-copy').css({
			'margin-left': -(windowScroll / 3) + "px",
			'opacity': 1 - (windowScroll / 300)
		});
		$('.home-header').css({
			'background-position': 'center ' + (-windowScroll / 8) + "px"
		});
		$('.home-header-nav').css({
			'opacity': 1 - (windowScroll / 150)
		});
	};

	SubApp.HomePageLayout = Marionette.Layout.extend({
		initialize: function(options) {
			this.app = this.options.app;
		},
		template: templates.homeLayout,
		events: {
			"click #start-searching": "startSearching"
		},
		regions: {
			user: '#header-user',
			search: '#search'
		},
		onRender: function() {
			var images = ['bg.jpg', 'bg-2.jpg', 'bg-3.jpg'];
			var isMobile = false,
				retina = window.devicePixelRatio ? window.devicePixelRatio > 1 : false;
			if (window.navigator) { 
				isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|Windows Phone|BlackBerry|Mobile)/);
			}
			if(!isMobile) {
				$(window).on('scroll resize', function() {
					titleslide();
				});
			} else {
				this.$('.home-header h1').css('position', 'absolute');
			}
			if (retina) {
				this.$('h1 img').attr('src', 'images/logo@2x.png');
			}
			// BG Image Randomizer
			this.$('.home-header').css({
				'background': 'url(images/' + images[Math.floor(Math.random() * images.length)] + ') no-repeat center top fixed',
				'-webkit-background-size': 'cover',
				'-moz-background-size': 'cover',
				'-o-background-size': 'cover',
				'background-size': 'cover'
			});
		},
		startSearching: function(e) {
			e.preventDefault();
			var location = '';
			if ($.cookie('user_location')) {
				location = $.cookie('user_location').formatQuery();
				this.app.navigate('#jobs/_/'+location, {trigger: true});
			} else {
				this.app.navigate('#jobs', {trigger: true});
			}
		}
	});

	console.log('home layout successfully loaded');
	return SubApp;
});
