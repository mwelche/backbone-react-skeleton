// js/modules/tooltip.js

define(function() {
	console.log('success loading the Tooltip Module');
	var Tooltip = {};
	return Tooltip = {
		show: function(text, time) {
			var global = $('.global-tooltip').eq(0),
				zIndex = parseInt(global.css('z-index'), 10),
				time = (typeof time === "undefined") ? 3000 : time;
			$('.wrapper').after("<div class='global-tooltip'>" + text + "</div>");
			setTimeout(function() {
				console.log(zIndex);
				zIndex += 1;
				$('.global-tooltip').eq(0).addClass('active').css('z-index', zIndex).delay(time).fadeOut(200, function() {
					this.remove();
				});
				console.log(zIndex);
			}, 0);
			$('.global-tooltip').click(function(e) {
				e.stopPropagation();
				$('.global-tooltip').dequeue().fadeOut(200, function() {
					this.remove();
				});
			});
		}
	};
});
