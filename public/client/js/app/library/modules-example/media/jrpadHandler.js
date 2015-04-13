// js/modules/media/jrpadHandler.js

define(function() {
	// ad*Location denotes where the ad will go within the list of jobs
	// the job array follows array indexing (0 === 1st job)
	var Ads = {},
		adOneLocation = 5, // ad placed BEFORE 6th unit
		adTwoLocation = 10, // ad placed BEFORE 7th unit
		adThreeLocation = 14; // ad placed AFTER 15th unit
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
			if (width > 1140) {
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
			if (width > 1509) {
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
	// Media.net ID's according to unit and size
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
	// Places either Google CSA or Media.net Unit in right rail
	// Add 'google' class to .jrp-right-ad element for CSA styling
	var rightSideAd = function(options) {
		console.log('load right side ad');
		var adParams = {},
			urlEncoded = '',
			url = '';
		for (val in options) {
			adParams[val] = $.trim(options[val]);
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
	// Places Google CSA ad unit in first position of Job Results
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
	// Places Google CSA ad unit in second position of Job Results
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
	// Places Google CSA ad unit in third position of Job Results
	var middleAdThree = function(options) {
		if ($('article').hasClass('job')) {
			var adParams = {},
				urlEncoded = '';
			for (val in options) {
				adParams[val] = options[val];
			}
			adParams.cid = "2620636107";
			adParams.page = parseInt(options.page,10)+2;
			urlEncoded = $.param(adParams);
			// Places ad AFTER last job
			$('.job').eq(adThreeLocation).after('<article class="ad middle-ad-three"><iframe scrolling="no" style="padding: 0.5rem 0.5rem 0;background-color: #fff; width:100%; height:auto; margin: 0;" src="'
			+window.location.protocol+'//api.'+window.location.host+'/server/ad?'+urlEncoded+'"></iframe></article>');
			console.log('load middle ad 3');
		}
	};
	// Places Media.net ad unit underneath the Pagination of the results page
	var bottomAd = function(options) {
		console.log('load bottom ad');
		var size = '',
			cid = '',
			position = '';
		// If the window is mobile sized (landscape or portrait), use the right side media.net ad instead
		if ($(window).width() < 481) {
			size = browserWidth("right");
			cid = mediaNetId.right[browserWidth("right")];
			position = "right";
		} else {
			size = browserWidth("bottom");
			cid = mediaNetId.bottom[browserWidth("bottom")];
			position = "bottom";
		}
		var adParams = {
				action: 1, // action = 1 sets the ad to a media.net unit
				position: position,
				size: size,
				cid: cid,
				keyword: $.trim(options.keyword),
				location: $.trim(options.loc)
			},
			urlEncoded = '',
			url = '';
		urlEncoded = $.param(adParams);
		url = window.location.protocol+'//api.'+window.location.host+'/server/ad?'+urlEncoded;
		$('.pagination-ad iframe').attr('src',url);
	};
	// Places CSA ad unit on 'no results'
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
				// rightSideAd(options);
				bottomAd(options);
			} else {
				// rightSideAd(options);
				middleAdOne(options);
				middleAdTwo(options);
				middleAdThree(options);
				bottomAd(options);
			}
		}
	};
});