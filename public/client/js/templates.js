// js/templates.js

define(function(require){
	"use strict";
	return {
		// Layouts
		twoRegionLayout: require('tpl!templates/twoRegionLayoutTemplate.tpl'),
		// Home
		home: require('tpl!templates/homeTemplate.tpl'),
		// Subpages
		privacy: require('tpl!templates/privacyTemplate.tpl'),
		contact: require('tpl!templates/contactTemplate.tpl'),
		// footer
		footer: require('tpl!templates/footerTemplate.tpl'),
		// Modals
		loginModal: require('tpl!templates/modalLoginTemplate.tpl')
	};
});
