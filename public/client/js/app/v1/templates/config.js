// js/templates.js

define(function(require){
	"use strict";
	return {
		// Layouts
		twoRegionLayout: require('tpl!templates/layouts/twoRegionLayoutTemplate.tpl'),
		// Home
		home: require('tpl!templates/home/homeTemplate.tpl'),
		// Subpages
		// privacy: require('tpl!templates/privacyTemplate.tpl'),
		// contact: require('tpl!templates/contactTemplate.tpl'),
		// footer
		footer: require('tpl!templates/footer/footerTemplate.tpl'),
		// Modals
		loginModal: require('tpl!templates/modals/modalLoginTemplate.tpl')
	};
});
