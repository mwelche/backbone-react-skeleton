// js/modules/search/shsearch.js

define(['modules/media/jrpadHandler', 'simplyhired', 'simplyKey', 'googleDoubleClick'], function(Ads) {
	// if there is a problem loading the Simply Hired tracking api, shTracking.js will be loaded as the fallback where var blocked is defined.
	if (typeof blocked !== 'undefined') {
		require(['modules/media/adblockmodal']);
	}
	var isMobile = false;
	if (window.navigator) {
		isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|Windows Phone|BlackBerry|Mobile)/);
	}
	var SimplySearch = {
		doSearch: function(dependencies) {
			var model = dependencies.model,
				collection = dependencies.collection,
				userModel = dependencies.userModel,
				options = {},
				urloptions = {},
				jto = model.get('jto'), // job title only
				pcid = '',
				user_id = 0,
				that = this;
			collection.reset();
			$('.ad').remove();
			options.q = model.get('keyword');
			options.l = model.get('location');
			options.d = model.get('daysBack');
			options.r = model.get('radius');
			options.p = model.get('page');
			options.jk = model.get('jobKey');
			options.limit = 15;
			options.start = options.p * options.limit - options.limit; // start 0
			urloptions.clip = '127.0.0.1';
			urloptions.pcids = pcid;
			// Wrap keyword with title:() if job title only is flagged true
			if (jto) {
				options.q = 'title:('+options.q+')';
			}
			$.when(checkChannel(), checkIP()).done(function (channel, ip) {
				console.log('SUCCESS!!');
				if (userModel.get('email') !== '') {
					pcid = isMobile ? channel[0].email.mobile : channel[0].email.desktop;
					user_id = userModel.get('_id');
				} else {
					pcid = isMobile ? channel[0].organic.mobile : channel[0].organic.desktop;
				}
				urloptions.clip = ip[0];
				urloptions.pcids = pcid;

				console.log('PCID:', pcid);
				console.log('IP:', ip[0]);
				console.log('NEW QUERY OPTIONS:', options);

				getJobs(model, collection, user_id, options, urloptions, userModel);
			}).fail(function() {
				console.log('FAIL!!');
				getJobs(model, collection, user_id, options, urloptions, userModel);
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
	var getJobs = function(model, collection, user_id, options, urloptions, userModel) {
		var sh_client = new SimplyHired("69502"),
			// number of possible pagination buttons.
			pageList = 10,
			newJobs = [];

		if ($(window).width() <= 480) {
			pageList = 5;
		}

		sh_client.search(options, urloptions, function (response) {
			console.log('SIMPLY HIRED RESPONSE:', response);
			console.log('TYPE OF RESPONSE', typeof response.error);
			// if no results, handle SH response
			response = handleNoResults(response);
			// Set total results count
			response.rq.tv = setTotalResults(options, response);

			var endRecord = setEndRecord(options.p, options.limit, response.rq.tv),
				// total number of pages derived from number of results divided by results/page.
				lastPage = Math.ceil(response.rq.tv / options.limit),
				// set the max page number for pagination set.
				maxPage = setMaxPage(lastPage, pageList),
				// the set (array) of page numbers.
				pageSet = setPagination(options.p, pageList, lastPage, maxPage);
			// Set all values attached to jobs model
			model.set({
				numResults: addCommas(response.rq.tv),
				totalRecords: addCommas(response.rq.tv),
				startRecord: options.start + 1,
				endRecord: endRecord,
				pageSet: pageSet,
				lastPage: lastPage
			});
			// CREATE JOB LIST
			// first check if there's a highlighted job from an email click
			if (options.jk !== '') {
				// Add Featured Job to Top of Results
				$.each(response.rs, function(idx, val) {
					if (val.jk === options.jk) {
						console.log("JOBKEY ON FIRST PAGE");
						newJobs = createJobList_featured(response.rs, options.jk, newJobs);
						// Reset job collection with new data
						collection.add(newJobs);
						// Highlight the featured Job.
						$('.job').eq(0).addClass('active');
						if (response.rq.tv !== 0) {
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
					} else if (idx === response.rs.length-1) {
						var jobKeyPromise = jobKeyLookup(options, urloptions.clip);
						jobKeyPromise.done(function(jobKeyResult) {
							createJobList_jobKeyLookup(response.rs, jobKeyResult, newJobs, collection);
							// Highlight the featured Job.
							$('.job').eq(0).addClass('active');
							console.log('THE COOKIE', $.cookie('user_location'));
							if (response.rq.tv !== 0) {
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
							newJobs = createJobList(response.rs, newJobs);
							collection.add(newJobs);
							console.log('THE COOKIE', $.cookie('user_location'));
							if (response.rq.tv !== 0) {
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
				newJobs = createJobList(response.rs, newJobs);
				// Reset job collection with new data
				collection.add(newJobs);

				console.log('THE COOKIE', $.cookie('user_location'));
				if (response.rq.tv !== 0) {
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
					ip:urloptions.clip,
					provider:"Simply Hired",
					channel:urloptions.pcids,
					page:options.p,
					page_result:response.rs.length,
					total_result:response.rq.tv
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
	// Handle SH no results response
	var handleNoResults = function(response) {
		if ((typeof response.error !== 'undefined' && (response.error === 'no-results' || response.error === 'invalid-location')) ||
			(response.rs.length === 0)) {
			response = {
				rq: {
					tr: 0,
					tv: 0,
				},
				rs: [{}]
			};
		}
		return response;
	};
	// adjust total results from Simply Hired
	var setTotalResults = function(options, response) {
		if (response.rq.tv !== 0) {
			if (response.rq.tv <= response.rs.length) {
				response.rq.tv = response.rs.length;
			} else {
				// SimplyHired most of the time gives full page jobs
				response.rq.tv = Math.ceil(response.rq.tv / options.limit) * options.limit;
			}
			return response.rq.tv;
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
				jobKey: val.jk,
				jobTitle: val.jt,
				company: val.cn,
				city: val.cty,
				state: val.st,
				formattedLoc: val.loc,
				wasAdded: val.posted_ago_string,
				description: val.e,
				link: val.url
			});
		});
		return newJobs;
	};
	// Make results list with a featured job when coming in from an email
	var createJobList_featured = function(rs, jk, newJobs) {
		// If featured job appears on page one.
		$.each(rs, function(idx, val) {
			var jobMap = {
				jobKey: val.jk,
				jobTitle: val.jt,
				company: val.cn,
				city: val.cty,
				state: val.st,
				formattedLoc: val.loc,
				wasAdded: val.posted_ago_string,
				description: val.e,
				link: val.url
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
				jobKey: val.jk,
				jobTitle: val.jt,
				company: val.cn,
				city: val.cty,
				state: val.st,
				formattedLoc: val.loc,
				wasAdded: val.posted_ago_string,
				description: val.e,
				link: val.url
			});
			// Add the rest of the jobs to the list from the Get-Jobs response.
			$.each(rs, function(idx, val) {
				if (idx < rs.length-1) {
					newJobs.push({
						jobKey: val.jk,
						jobTitle: val.jt,
						company: val.cn,
						city: val.cty,
						state: val.st,
						formattedLoc: val.loc,
						wasAdded: val.posted_ago_string,
						description: val.e,
						link: val.url
					});
				}
			});
			console.log('THE FEATURED JOB LIST:', newJobs);
			// Reset job collection with new data
			collection.add(newJobs);
	};
	var jobKeyLookup = function(options, clip) {
		console.log("CHECKING JOBKEY");
		var sh_jobkey = new SimplyHiredKey("69502"),
			data = {keyword: options.q, jobkey: options.jk},
			urlOptions = {clip: clip};
		return $.when(sh_jobkey.search(data,urlOptions));
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

	return SimplySearch;
});
