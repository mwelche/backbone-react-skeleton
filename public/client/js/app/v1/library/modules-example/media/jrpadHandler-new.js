// js/modules/media/jrpadHandler.js

define(function() {
	var Ads = {};
	return Ads = {
		adOneLocation: 5,
		adTwoLocation: 10,
		rightSideAd: function(element) {
			console.log('load right side ad');
			$('.jrp-right-ad').attr({
				'id': 'CareerAlerts-jrp-right',
				'data-size-mapping': 'right-side'
			}).dfp({
				dfpID: '27868951',
				sizeMapping: {
					'right-side': [
						{browser: [2560,1440], ad_sizes: [240, 400]},
						{browser: [1440, 900], ad_sizes: [160, 600]},
						{browser: [1024, 768], ad_sizes: [120, 600]},
						{browser: [   0,   0], ad_sizes: [120, 600]}
					]
				}
			});
		},
		middleAdOne: function(element) {
			var adOneLocation = this.adOneLocation;
			if ($('article').hasClass('job')) {
				$('.job').eq(adOneLocation).before('<article class="ad middle-ad-one" id="jrp-results-ad" data-size-mapping="middle"></article>');
				$('.middle-ad-one').dfp({
					dfpID: '27868951',
					sizeMapping: {
						'middle': [
							{browser: [2560,1440], ad_sizes: [920, 75]},
							{browser: [1600,1200], ad_sizes: [760, 75]},
							{browser: [1280,1024], ad_sizes: [640, 75]},
							{browser: [1024, 768], ad_sizes: [580, 75]},
							{browser: [   0,   0], ad_sizes: [288, 68]}
						]
					}
				});
				console.log('load middle ad 1');
			}
		},
		middleAdTwo: function(element) {
			var adTwoLocation = this.adTwoLocation;
			if ($('article').hasClass('job')) {
				$('.job').eq(adTwoLocation).before('<article class="ad middle-ad-two" id="CareerAlerts-jrp-results-middle-2" data-size-mapping="middle"></article>');
				$('.middle-ad-two').dfp({
					dfpID: '27868951'
				});
				console.log('load middle ad 2');
			}
		}
	};
});