// js/modules/search/shsearch.js

define(['modules/media/jrpadHandler', 'indeed', 'indeedKey'], function(Ads) {
	// if there is a problem loading the Indeed tracking api, indeedTracking.js will be loaded as the fallback where var blocked is defined.
	if (typeof blocked !== 'undefined') {
		require(['modules/media/adblockmodal']);
	}
	var isMobile = false;
	if (window.navigator) {
		isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|Windows Phone|BlackBerry|Mobile)/);
	}
	var IndeedSearch = {
		doSearch: function(dependencies) {
			var model = dependencies.model,
				collection = dependencies.collection,
				userModel = dependencies.userModel,
				options = {},
				jto = model.get('jto'), // job title only
				chnl = '',
				user_id = 0,
				that = this;
			collection.reset();
			$('.ad').remove();
			options.q = model.get('keyword');
			options.l = model.get('location');
			options.fromage = model.get('daysBack');
			options.radius = model.get('radius');
			options.p = model.get('page');
			options.jk = model.get('jobKey');
			options.limit = 15;
			options.useragent = navigator.userAgent;
			options.start = options.p * options.limit - options.limit; // start 0
			options.userip = '127.0.0.1';
			options.chnl = chnl;
			// Wrap keyword with title:() if job title only is flagged true
			if (jto) {
				options.q = 'title:('+options.q+')';
			}
			$.when(checkChannel(), checkIP()).done(function (channel, ip) {
				console.log('SUCCESS!!');
				if (userModel.get('email') !== '') {
					chnl = isMobile ? channel[0].email.mobile : channel[0].email.desktop;
					user_id = userModel.get('_id');
				} else {
					chnl = isMobile ? channel[0].organic.mobile : channel[0].organic.desktop;
				}
				options.userip = ip[0];
				options.chnl = chnl;

				console.log('CHANNEL:', chnl);
				console.log('IP:', ip[0]);
				console.log('NEW QUERY OPTIONS:', options);

				getJobs(model, collection, user_id, options, userModel);
			}).fail(function() {
				console.log('FAIL!!');
				getJobs(model, collection, user_id, options, userModel);
			});
		}
	};
	// Check the traffic type to determine the correct channel
	var checkChannel = function() {
		return $.jsonp({
			url: location.protocol + "//api." + location.hostname + "/server/channel/",
			callbackParameter: "callback",
			timeout: 5000
		});
	};
	// Get Client IP Address
	var checkIP = function() {
		return $.jsonp({
			url: location.protocol + "//api." + location.hostname + "/server/ip/",
			callbackParameter: "callback",
			timeout: 5000
		});
	};
	var getJobs = function(model, collection, user_id, options, userModel) {
		var indeed_client = new Indeed("7818408010772620"),
			// number of possible pagination buttons.
			pageList = 10,
			newJobs = [];

		if ($(window).width() <= 480) {
			pageList = 5;
		}

		indeed_client.search(options, function (response) {
			console.log('Indeed RESPONSE:', response);
			// if no results, handle SH response
			response = handleNoResults(response);
			// Set total results count
			response.totalResults = setTotalResults(options, response);

			var endRecord = setEndRecord(options.p, options.limit, response.totalResults),
				// total number of pages derived from number of results divided by results/page.
				lastPage = Math.ceil(response.totalResults / options.limit),
				// set the max page number for pagination set.
				maxPage = setMaxPage(lastPage, pageList),
				// the set (array) of page numbers.
				pageSet = setPagination(options.p, pageList, lastPage, maxPage);
			// Set all values attached to jobs model
			model.set({
				numResults: addCommas(response.totalResults),
				totalRecords: addCommas(response.totalResults),
				startRecord: options.start + 1,
				endRecord: endRecord,
				pageSet: pageSet,
				lastPage: lastPage
			});
			// CREATE JOB LIST
			// first check if there's a highlighted job from an email click
			if (options.jk !== '') {
				// Add Featured Job to Top of Results
				$.each(response.results, function(idx, val) {
					if (val.jk === options.jk) {
						console.log("JOBKEY ON FIRST PAGE");
						newJobs = createJobList_featured(response.results, options.jk, newJobs);
						// Reset job collection with new data
						collection.add(newJobs);
						// Highlight the featured Job.
						$('.job').eq(0).addClass('active');
						if (response.totalResults !== 0) {
							var adLocation = (model.get('location') || $.cookie('user_location'));
							var adOptions = {
								keyword: model.get('keyword'),
								page: model.get('page'),
								loc: adLocation
							};
							var numResults = model.get('numResults');
							placeAds(adOptions, numResults);
						}
						return false;
					} else if (idx === response.results.length-1) {
						var jobKeyPromise = jobKeyLookup(options);
						jobKeyPromise.done(function(jobKeyResult) {
							createJobList_jobKeyLookup(response.results, jobKeyResult, newJobs, collection);
							// Highlight the featured Job.
							$('.job').eq(0).addClass('active');
							console.log('THE COOKIE', $.cookie('user_location'));
							if (response.totalResults !== 0) {
								var adLocation = (model.get('location') || $.cookie('user_location'));
								var adOptions = {
									keyword: model.get('keyword'),
									page: model.get('page'),
									loc: adLocation
								};
								var numResults = model.get('numResults');
								placeAds(adOptions, numResults);
							}
						}).fail(function() {
							require(['modules/tooltip'], function(Tooltip) {
								Tooltip.show("This job posting is no longer available. Here are other similar jobs in your area.");
							});
							console.log('NO FEATURED JOB FOUND FROM JOB KEY LOOKUP');
							newJobs = createJobList(response.results, newJobs);
							collection.add(newJobs);
							console.log('THE COOKIE', $.cookie('user_location'));
							if (response.totalResults !== 0) {
								var adLocation = (model.get('location') || $.cookie('user_location'));
								var adOptions = {
									keyword: model.get('keyword'),
									page: model.get('page'),
									loc: adLocation
								};
								var numResults = model.get('numResults');
								placeAds(adOptions, numResults);
							}
						});
					}
				});
			} else {
			// Normal Job Results List.
				newJobs = createJobList(response.results, newJobs);
				// Reset job collection with new data
				collection.add(newJobs);

				console.log('THE COOKIE', $.cookie('user_location'));
				if (response.totalResults !== 0) {
					var adLocation = (model.get('location') || $.cookie('user_location'));
					var adOptions = {
						keyword: model.get('keyword'),
						page: model.get('page'),
						loc: adLocation
					};
					var numResults = model.get('numResults');
					placeAds(adOptions, numResults);
				}
			}
			// Metrics collect for job search
			$.jsonp({
				url: location.protocol + "//api." + location.hostname + "/metrics/search/",
				callbackParameter: "callback",
				data: {
					user_id:user_id, // 0 or string
					keyword:options.q,
					location:options.l,
					days_back:options.d,
					radius:options.r,
					ip:options.userip,
					provider:"Indeed",
					channel:options.chnl,
					page:options.p,
					page_result:response.results.length,
					total_result:response.totalResults
				},
				success: function(result){
					model.set({
						_id: result // search id for result click tracking
					});
					console.log(model.get('_id'));
				},
				error: function(xOptions, textStatus) {
					console.log(textStatus);
				}
			});
		});
	};
	// Handle Indeed no results response
	var handleNoResults = function(response) {
		if (response.results.length === 0) {
			response.results = [{}];
		}
		return response;
	};
	// adjust total results from Indeed
	var setTotalResults = function(options, response) {
		if (response.totalResults !== 0) {
			if (response.totalResults <= response.results.length) {
				response.totalResults = response.results.length;
			} else {
				// Indeed most of the time gives full page jobs
				response.totalResults = Math.ceil(response.totalResults / options.limit) * options.limit;
			}
			return response.totalResults;
		} else {
			return 0;
		}
	};
	// Set end record
	var setEndRecord = function(currentPage, resultsPerPage, totalViewable) {
		var endRecord = currentPage * resultsPerPage;
		if (endRecord > totalViewable) {
			endRecord = totalViewable;
		}
		return endRecord;
	};
	var setMaxPage = function (lastPage, pageList) {
		var maxPage;
		// If last page is greater than 10, set the max page (for pagination) to 10
		if (lastPage > pageList) {
			maxPage = pageList;
		} else {
			maxPage = lastPage;
		}
		return maxPage;
	};
	var setPagination = function(currentPage, pageList, lastPage, maxPage) {
		var pageSet = [];
		if (currentPage > pageList - 3) {
			if (pageList > 5) {
				pageSet = [1, 2, '...', currentPage-3, currentPage-2, currentPage-1, currentPage];
				if (lastPage >= parseInt(currentPage, 10)+1) {
					pageSet.push(parseInt(currentPage, 10)+1);
				}
				if (lastPage >= parseInt(currentPage, 10)+2) {
					pageSet.push(parseInt(currentPage, 10)+2);
				}
				if (lastPage >= parseInt(currentPage, 10)+3) {
					pageSet.push(parseInt(currentPage, 10)+3);
				}
			} else {
				pageSet = [1, 2, '...', currentPage];
				if (lastPage >= parseInt(currentPage, 10)+1) {
					pageSet.push(parseInt(currentPage, 10)+1);
				}
			}
		} else {
			for (var i = 1; i <= maxPage; i++) {
				pageSet.push(i);
			}
		}
		return pageSet;
	};
	// Make results list
	var createJobList = function(rs, newJobs) {
		$.each(rs, function(idx, val) {
			newJobs.push({
				jobKey: val.jobkey,
				jobTitle: val.jobtitle,
				company: val.company,
				city: val.city,
				state: val.state,
				formattedLoc: val.formattedLocation,
				wasAdded: val.formattedRelativeTime,
				description: val.snippet,
				link: val.url,
				onmousedown: $.trim(val.onmousedown.split("{")[1].split("}")[0])
			});
		});
		return newJobs;
	};
	// Make results list with a featured job when coming in from an email
	var createJobList_featured = function(rs, jk, newJobs) {
		// If featured job appears on page one.
		$.each(rs, function(idx, val) {
			var jobMap = {
				jobKey: val.jobkey,
				jobTitle: val.jobtitle,
				company: val.company,
				city: val.city,
				state: val.state,
				formattedLoc: val.formattedLocation,
				wasAdded: val.formattedRelativeTime,
				description: val.snippet,
				link: val.url,
				onmousedown: $.trim(val.onmousedown.split("{")[1].split("}")[0])
			};
			if (val.jk === jk) {
				newJobs.unshift(jobMap);
			} else {
				newJobs.push(jobMap);
			}
		});
		return newJobs;
	};
	// Make results list using Job Key lookup if featured job isn't in first set of results.
	var createJobList_jobKeyLookup = function(rs, jobkeyres, newJobs, collection) {
			console.log(jobkeyres);
			var val = jobkeyres;
			// Push the job from the Job-Key-Lookup to the beginning of the list
			newJobs.push({
				jobKey: val.jobkey,
				jobTitle: val.jobtitle,
				company: val.company,
				city: val.city,
				state: val.state,
				formattedLoc: val.formattedLocation,
				wasAdded: val.formattedRelativeTime,
				description: val.snippet,
				link: val.url,
				onmousedown: $.trim(val.onmousedown.split("{")[1].split("}")[0])
			});
			// Add the rest of the jobs to the list from the Get-Jobs response.
			$.each(rs, function(idx, val) {
				if (idx < rs.length-1) {
					newJobs.push({
						jobKey: val.jobkey,
						jobTitle: val.jobtitle,
						company: val.company,
						city: val.city,
						state: val.state,
						formattedLoc: val.formattedLocation,
						wasAdded: val.formattedRelativeTime,
						description: val.snippet,
						link: val.url,
						onmousedown: $.trim(val.onmousedown.split("{")[1].split("}")[0])
					});
				}
			});
			console.log('THE FEATURED JOB LIST:', newJobs);
			// Reset job collection with new data
			collection.add(newJobs);
	};
	var jobKeyLookup = function(options, clip) {
		console.log("CHECKING JOBKEY");
		var indeed_jobkey = new IndeedKey("7818408010772620"),
			data = {jobkey: options.jk};
		return $.when(indeed_jobkey.search(data));
	};
	var placeAds = function(options) {
		Ads.resultsPage(options);
	};
	var addCommas = function(nStr) {
		nStr += '';
		var x = nStr.split('.'),
			x1 = x[0],
			x2 = x.length > 1 ? '.' + x[1] : '',
			rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2;
	};

	return IndeedSearch;
});
