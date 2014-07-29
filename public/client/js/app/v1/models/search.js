// js/modules/models/search.js
console.log('search.js loaded.');
define(['marionette'], function(Marionette) {
	var Search = {};

	Search.JobModel = Backbone.Model.extend({
		//default attributes of a job
		defaults: {
			// Jobs
			jobKey: '',
			jobTitle: 'Job Title Missing',
			company: '',
			city: '',
			state: '',
			formattedLoc: '',
			wasAdded: 'unknown',
			description: "We\'re sorry, there\'s been an error getting the job description.",
			link: '',
			type: '' // sponsored, organic
		}
	});

	Search.Model = Backbone.Model.extend({
		defaults: {
			_id: '', // MongoDB ObjectId
			// Results Count
			numResults: "0",
			keyword: '',
			location: '',
			radius: 25,
			daysBack: 14,
			// Pagination
			page: 1,
			perPage: 10,
			displayPerPage: 15,
			startRecord: 0,
			endRecord: 0,
			totalRecords: 0,
			pageSet: [1],
			lastPage: 1,
			// Job Title Only
			jto: false,
			// List View
			listView: true,
			// Featured Job from Email
			jobKey: ''
		}
	});

	//results collection
	Search.Results = Backbone.Collection.extend({
		model: Search.JobModel
	});

	console.log('success loading search models');

	return Search;
});
