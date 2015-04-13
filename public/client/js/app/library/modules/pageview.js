define(function() {
	var Pageview = {};
	Pageview = {
		isMobile: function() {
			if (navigator.userAgent.match(/Android/i) ||
				navigator.userAgent.match(/webOS/i)   ||
				navigator.userAgent.match(/iPhone/i)  ||
				navigator.userAgent.match(/iPad/i)    ||
				navigator.userAgent.match(/iPod/i)    ||
				navigator.userAgent.match(/BlackBerry/i)) {
				return true;
			} else {
				return false;
			}
		},
		countPageView: function() {
			if (this.isMobile()) {
				console.log("mobile view");
				this.recordPageView("mobile");
				this.isUniqueVisitor("mobile");
			} else {
				console.log("desktop view");
				this.recordPageView("desktop");
				this.isUniqueVisitor("desktop");
			}
		},
		getServerToday: function(callback) {
			Backbone.ajax({
				url: location.protocol + "//api." + location.hostname + "/metrics/getServerToday/",
				dataType: "jsonp",
				success: callback,
				error: function(jqXHR, textStatus, errorThrown){
					console.log("getServerToday function error");
				}
			});
		},
		isUniqueVisitor: function(type) {
			if (typeof $.cookie('visited_date') === 'undefined') {
				this.getServerToday(function(callback) {
					$.cookie('visited_date', callback, { expires: 1 });
					Backbone.ajax({
						url: location.protocol + "//api." + location.hostname + "/metrics/uniqueVisitor/",
						dataType: "jsonp",
						data: {type:type},
						success: callback,
						error: function(jqXHR, textStatus, errorThrown){
							console.log("recordPageView function error");
						}
					});
					console.log(type + " unique visitor");
				});
			} else {
				this.getServerToday(function(callback) {
					if ($.cookie('visited_date') !== callback) {
						$.cookie('visited_date', callback, { expires: 1 });
						Backbone.ajax({
							url: location.protocol + "//api." + location.hostname + "/metrics/uniqueVisitor/",
							dataType: "jsonp",
							data: {type:type},
							success: callback,
							error: function(jqXHR, textStatus, errorThrown){
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
			Backbone.ajax({
				url: location.protocol + "//api." + location.hostname + "/metrics/pageView/",
				dataType: "jsonp",
				data: {type:type},
				success: callback,
				error: function(jqXHR, textStatus, errorThrown){
					console.log("recordPageView function error");
				}
			});
		}
	};
	return Pageview;
});
