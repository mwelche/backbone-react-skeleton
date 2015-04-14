// js/modules/media/jrpadHandler.js

define(function() {
	var Ads = {},
		adOneLocation = 5,
		adTwoLocation = 10;
	var browserWidth = function(location) {
		var width = $(window).width(),
			dataDimension;
		if (location === "middle") {
			if (width > 480) {
				return "468x60";
			} else {
				return "320x50";
			}
		}
		if (location === "right") {
			if (width > 1024) {
				return "medium";
			} else if (width > 768) {
				return "small";
			} else if (width === 768) {
				return "medium";
			} else if (width > 480) {
				return "small";
			} else {
				return "large";
			}
		}
		if (location === "noJobs") {
			if (width >= 768) {
				return "250x250";
			} else if (width > 600) {
				return "200x200";
			} else if (width >= 480) {
				return "250x250";
			} else {
				return "200x200";
			}
		}
		if (location === "bottom") {
			if (width > 1759) {
				return "large";
			} else if (width > 1509) {
				return "large";
			} else if (width > 1170) {
				return "medium";
			} else if (width === 768) {
				return "large";
			} else if (width > 480) {
				return "small";
			} else {
				return "small";
			}
		}
	};
	var mediaNetId = {
		right: {
			small: "392920475",
			medium: "146297001",
			large: "561624281"
		},
		bottom: {
			small: "832536413",
			medium: "317481336",
			large: "511287953"
		}
	};
	var rightSideAd = function(options) {
		console.log('load right side ad');
		var adParams = {},
			urlEncoded = '',
			url = '';
		for (val in options) {
			adParams[val] = options[val];
		}
		// Action decides between media.net and adsense unit
		adParams.action = 1; // action = 1 sets the ad to a media.net unit
		adParams.position = "right";
		adParams.size = browserWidth("right");
		adParams.cid = mediaNetId.right[browserWidth("right")];

		urlEncoded = $.param(adParams);
		url = window.location.protocol+'//api.'+window.location.host+'/server/ad?'+urlEncoded;
		$('.jrp-right-ad iframe').attr('src',url);
	};
	var	middleAdOne = function(options) {
		if ($('article').hasClass('job')) {
			var adParams = {},
				urlEncoded = '';
			for (val in options) {
				adParams[val] = options[val];
			}
			adParams.cid = "5691853702";
			urlEncoded = $.param(adParams);
			$('.job').eq(adOneLocation).before('<article class="ad middle-ad-one"><iframe scrolling="no" style="padding: 0.5rem 0.5rem 0;background-color: #fff; width:100%; height:auto" src="'
			+window.location.protocol+'//api.' + 
			window.location.host+'/server/ad?'+urlEncoded+'"></iframe></article>');
			console.log('load middle ad 1');
		}
	};
	var middleAdTwo = function(options) {
		if ($('article').hasClass('job')) {
			var adParams = {},
				urlEncoded = '';
			for (val in options) {
				adParams[val] = options[val];
			}
			adParams.cid = "1143902906";
			adParams.page = parseInt(options.page,10)+1;
			urlEncoded = $.param(adParams);
			$('.job').eq(adTwoLocation).before('<article class="ad middle-ad-two"><iframe scrolling="no" style="padding: 0.5rem 0.5rem 0;background-color: #fff; width:100%; height:auto; margin: 0;" src="'
			+window.location.protocol+'//api.'+window.location.host+'/server/ad?'+urlEncoded+'"></iframe></article>');
			console.log('load middle ad 2');
		}
	};
	var bottomAd = function() {
		console.log('load bottom ad');
		var adParams = {
				action: 1, // action = 1 sets the ad to a media.net unit
				position: "bottom",
				size: browserWidth("bottom"),
				cid: mediaNetId.right[browserWidth("bottom")]
			},
			urlEncoded = '',
			url = '';
		urlEncoded = $.param(adParams);
		url = window.location.protocol+'//api.'+window.location.host+'/server/ad?'+urlEncoded;
		$('.pagination-ad iframe').attr('src',url);
	};
	var noJobsAd = function(options) {
		if ($('#jobResultsContent .noJob').length) {
			console.log('adding no job ad');
			var adParams = {},
				urlEncoded = '',
				url = '';
			for (val in options) {
				adParams[val] = options[val];
			}
			adParams.num = 3;
			urlEncoded = $.param(adParams);
			url = window.location.protocol+'//api.'+window.location.host+'/server/ad?'+urlEncoded;
			$('.no-results-ad iframe').attr('src',url);
		}
		console.log('load noJobs ad');
	};
	return Ads = {
		// options = { keyword: string, page: int }
		resultsPage: function(options, numResults) {
			numResults = typeof numResults === 'undefined' ? 1 : numResults;
			if (parseInt(numResults,10) === 0) {
				noJobsAd(options);
				rightSideAd(options);
				bottomAd();
			} else {
				rightSideAd(options);
				middleAdOne(options);
				middleAdTwo(options);
				bottomAd();
			}
		}
	};
});