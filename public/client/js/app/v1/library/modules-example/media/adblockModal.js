console.log('AD BLOCKER DETECTED');
var mouseX,
	mouseY,
	// Adding the content to variables
	title = "Uh oh, we've detected an Ad Blocker",
	content = "Here at Career Alerts, we rely on a few necessary scripts for <span>metrics collection</span>, scripts that ad-blocking extensions like to prevent from loading in your browser. In order for us to assist you in your job search, we ask that you use our site with your ad blocker turned off.<br/><br/>Thanks!<br/>- Career Alerts Team",
	subcontent = "<b>Please disable your Ad Blocker, then refresh the page to continue using Career Alerts</b>",
	tooltip = "(ex: jobs clicked, keywords and locations searched). We do not collect any personal information without your knowledge and consent!",
	adblockContent = "<h1>" + title + "</h1 >" + 
					"<div class='content'>" + content + "</div>" +
					"<div>" + subcontent + "</div>";
// Putting it all together
$('.wrapper').after("<div class='adblockWrapper'><div class='adblock'></div></div>");
$('.adblock').append(adblockContent).after("<div class='tooltip'>" + tooltip + "</div>");
// Event handlers
$(document).mousemove( function(e) {
	mouseX = e.pageX;
	mouseY = e.pageY - window.pageYOffset;
});
$('.adblock span').hover(function() {
	// Tooltip
	var edge = mouseX + 360;
	if (window.innerWidth < edge) {
		var difference = edge - window.innerWidth + 10;
		$('.adblockWrapper .tooltip').css('margin-left', difference*=-1);
	} else {
		$('.adblockWrapper .tooltip').css('margin', 0);
	}
	$('.adblockWrapper .tooltip').css({'top':mouseY,'left':mouseX}).fadeIn('fast');
}, function() {
	$('.adblockWrapper .tooltip').hide();
});