Controller.initSubPage = function(Subpage, Layout) {
	// Create the Layout if it doesnt already exist
	if ((_.isUndefined(this.app.wrapper.currentView)) || (this.app.wrapper.currentView !== Layout.subpage)) {
		// to save the context of 'this'
		var that = this;
		console.log('BUILDING SUBPAGE LAYOUT');
		Layout.subpage = new Subpage.Layout({
			app: this.app
		});
		this.app.wrapper.show(Layout.subpage);

		// View of Search Bar
		Layout.searchView = new Searchview({
			el: '#searchContent',
			app: that.app,
			model: that.searchModel,
			userModel: that.userModel
		});

		Layout.sidenav = new Sidenav.View({
			userModel: that.userModel
		});
		Layout.subpage.left.show(Layout.sidenav);
	}
	Layout.subpage.activeRoute();
	// Scroll to top of the page if not at the top already.
	if ($(window).scrollTop() !== 0) { window.scrollTo(0, 0); }
	return Layout;
};
