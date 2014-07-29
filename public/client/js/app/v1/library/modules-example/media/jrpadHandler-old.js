// js/modules/media/jrpadHandler.js

define(function() {
	var Ads = {};
	return Ads = {
		adOneLocation: 5,
		adTwoLocation: 10,
		rightSideAd: function(element) {
			console.log('load right side ad');
			/* require(["//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"], function() {
				$(element).html(
					"<style>.calerts-results-page-resp-1 { width: 100%; height: 500px; } @media(min-width: 500px) { .calerts-results-page-resp-1 { width: 100%; height: 500px; } } @media(min-width: 800px) { .calerts-results-page-resp-1 { width: 100%; height: 500px; } } </style>" + 
					"<ins class='adsbygoogle calerts-results-page-resp-1' style='display:inline-block' data-ad-client='ca-pub-2202016470033432' data-ad-slot='6047047708'></ins>" + 
					"<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>"
				);
			}); */
		},
		middleAdOne: function(element) {
			var that = this;
			/* if ($('article').hasClass('job')) {
				$(element).eq(this.adOneLocation).before("<article class='ad' id='middle-ad-one'></article>");
				console.log('load middle ad 1');
				require(["//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"], function() {
					$('#middle-ad-one').html(
						"<style>.calerts-results-page-resp-2 { width: 100%; height: 50px; } @media(min-width: 500px) { .calerts-results-page-resp-2 { width: 100%; height: 60px; } } @media(min-width: 800px) { .calerts-results-page-resp-2 { width: 100%; height: 90px; } }</style>" + 
						"<ins class='adsbygoogle calerts-results-page-resp-2' style='display:inline-block' data-ad-client='ca-pub-2202016470033432' data-ad-slot='4344498501'></ins>" + 
						"<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>"
					);
				});
			} */
		},
		middleAdTwo: function(element) {
			var that = this;
			/* if ($('article').hasClass('job')) {
				$(element).eq(that.adTwoLocation).before("<article class='ad' id='middle-ad-two'></article>");
				console.log('load middle ad 2');
				require(["//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"], function() {
					$('#middle-ad-two').html(
						"<style>.calerts-results-page-resp-3 { width: 100%; height: 120px; } @media(min-width: 500px) { .calerts-results-page-resp-3 { width: 100%; height: 120px; } } @media(min-width: 800px) { .calerts-results-page-resp-3 { width: 100%; height: 120px; } } </style>" + 
						"<ins class='adsbygoogle calerts-results-page-resp-3' style='display:inline-block' data-ad-client='ca-pub-2202016470033432' data-ad-slot='8774698108'></ins>" + 
						"<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>"
					);
				});
			} */
		}
	};
});