// js/modules/tooltip.js

define(function() {
	console.log('success loading the Tooltip Module');
	var Tooltip = {};
	return Tooltip = {
		show: function(text) {
			var global = $('.global-tooltip').eq(0),
				zIndex = parseInt(global.css('z-index'), 10);
			$('#main-content').after("<div class='global-tooltip'>" + text + "</div>");
			setTimeout(function() {
				console.log(zIndex);
				zIndex += 1;
				$('.global-tooltip').eq(0).addClass('active').css('z-index', zIndex).delay(2000).fadeOut(200, function() {
					this.remove();
				});
				console.log(zIndex);
			}, 0);
		}
	};
});
