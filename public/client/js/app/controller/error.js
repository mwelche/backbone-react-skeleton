Controller.error = function(code) {
	var Layout = this.Layout,
		that = this;
	require(['modules/subpages/subpageLayout', 'modules/subpages/subpageView'], function(Subpage, Sub) {
		utility.dom.change.title('404 Not Found');
		// Build initial Subpage Layout
		Layout = that.initSubPage(Subpage, Layout);
		Layout.notFound = new Sub.NotFoundView();
		Layout.subpage.middle.show(Layout.notFound);
	});
};
