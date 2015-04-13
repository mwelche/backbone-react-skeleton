define(function() {
	var Pageview = {};
	Pageview = {
		isMobile: function() {
			var isMobile = false;
			if (window.navigator) {
				isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|Windows Phone|BlackBerry|Mobile)/);
			}
			return isMobile;
		},
		countPageView: function() {
			if (this.isMobile()) {
				$.when(this.recordPageView("mobile")).done(
					this.isUniqueVisitor("mobile")
				);
			} else {
				$.when(this.recordPageView("desktop")).done(
					this.isUniqueVisitor("desktop")
				);
			}
		},
		getServerToday: function(callback) {
			$.jsonp({
				url: location.protocol + "//api." + location.hostname + "/metrics/getServerToday/",
				callbackParameter: "callback",
				success: callback,
				error: function(xOptions, textStatus){
					console.log("getServerToday function error");
				}
			});
		},
		isUniqueVisitor: function(type) {
			if (typeof $.cookie('visited_date') === 'undefined') {
				this.getServerToday(function(callback) {
					$.cookie('visited_date', callback, { expires: 1 });
					$.jsonp({
						url: location.protocol + "//api." + location.hostname + "/metrics/uniqueVisitor/",
						callbackParameter: "callback",
						data: {type:type},
						success: callback,
						error: function(xOptions, textStatus){
							console.log("recordPageView function error");
						}
					});
					console.log(type + " unique visitor");
				});
			} else {
				this.getServerToday(function(callback) {
					if ($.cookie('visited_date') !== callback) {
						$.cookie('visited_date', callback, { expires: 1 });
						$.jsonp({
							url: location.protocol + "//api." + location.hostname + "/metrics/uniqueVisitor/",
							callbackParameter: "callback",
							data: {type:type},
							success: callback,
							error: function(xOptions, textStatus){
								console.log("recordPageView function error");
							}
						});
						console.log(type + " unique old visitor");
					} else {
						//$.removeCookie('visited_date'); // for testing
						console.log(type + " not unique visitor");
					}
				});
			}
		},
		recordPageView: function(type, callback) {
			$.jsonp({
				url: location.protocol + "//api." + location.hostname + "/metrics/pageView/",
				callbackParameter: "callback",
				data: {type:type},
				success: callback,
				error: function(xOptions, textStatus){
					console.log("recordPageView function error");
				}
			});
		}
	};
	return Pageview;
});
