// app/controller/home.js

console.log('Home Controller js loaded!');
define(['twoRegionLayout', 'views/home', 'views/footer'], function(Layout, Home, Footer) {
	return function() {
		// require(["util", "domUtil"], function(){
			// utility.dom.change.title();
		// });
		// Layout Object
		// App object from initialized options
		console.log("what is this?", this);
		console.log('About to load home layout!');	
		// Layout
		var homeLayout = new Layout();
		this.app.content.show(homeLayout);

		var homeView = new Home.View();
		var footerView = new Footer.View();

		// Show Views in regions of layout
		homeLayout.content.show(homeView);
		homeLayout.footer.show(footerView);
		console.log('Home method called!');
	};
});
