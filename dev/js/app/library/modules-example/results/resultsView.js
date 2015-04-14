// js/modules/results/resultsView.js
define(['marionette',
		'modules/loading',
		'templates',
		'autocomplete'],
		function(
			Marionette,
			Loading,
			templates
) {
	var SubApp = {},
		isMobile = false;
	if (window.navigator) {
		isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|Windows Phone|BlackBerry|Mobile)/);
	}
	var jobTitleCheck = function(q, model) {
		if (model.get('jto')) {
			q = 'title:('+q+')';
		}
		return q;
	};
	// Results Filter8 View
	SubApp.FilterView = Marionette.ItemView.extend({
		initialize: function(options) {
			this.app = options.app;
			this.model = options.model;
			this.userModel = options.userModel;

			// search query variables
			this.r = this.model.get('radius');
			this.d = this.model.get('daysBack');
			this.p = this.model.defaults.page;
			this.jobTitleOnlyHandler();
			this.initMobileDigest();
			this.renderListView();
			this.renderDaysBack();
			this.renderRadius();
			if (!isMobile) {
				this.tooltips();
			}
		},
		events: {
			"click .filter-dropdown": "dropdown",
			"click #days-back li a": "filterDaysBack",
			"click #radius li a": "filterRadius",
			"click #job-title-only": "triggerJobTitleOnly",
			"click #add-alert": "saveSearch",
			"click #mobile-digest": "triggerMobileDigest",
			"click #list-view": "triggerListView"
		},
		modelEvents: {
			"change:daysBack": "renderDaysBack",
			"change:radius": "renderRadius",
			"change:jto": "modelChanged",
			"change:listView":"renderListView"
		},
		modelChanged: function() {
			this.jobTitleOnlyHandler();
		},
		renderDaysBack: function() {
			console.log('Days Back CHANGED');
			this.$('#days-back .active-filter').html(this.model.get('daysBack'));
		},
		renderRadius: function() {
			console.log('Radius CHANGED');
			this.$('#radius .active-filter').html(this.model.get('radius'));
		},
		dropdown: function(e) {
			$(e.currentTarget).toggleClass("active");
			e.stopPropagation();
			$(document).click(function() {
				$(".filter-dropdown").removeClass("active");
			});
		},
		filterDaysBack: function(e) {
			e.preventDefault();
			this.d = parseInt($(e.target).attr('name'), 10);
			this.filterSearch();
		},
		filterRadius: function(e) {
			e.preventDefault();
			this.r = parseInt($(e.target).attr('name'), 10);
			this.filterSearch();
		},
		filterSearch: function() {
			var q = jobTitleCheck(this.model.get('keyword'), this.model).formatQuery(),
				l = this.model.get('location').formatQuery();
			console.log('radius:', this.r);
			console.log('daysback:', this.d);
			this.app.navigate('jobs/' + q + '/' + l + '/' + this.p + '/' + this.r + '/' + this.d, {trigger:true});
		},
		jobTitleOnlyHandler: function() {
			// this sets the "job title only" feature status as active/inactive on the UI level. (in the DOM)
			if (this.model.get('jto')) {
				this.$('#job-title-only').addClass('active');
				if (isMobile) {
					require(['modules/tooltip'], function(Tooltip) {
						Tooltip.show("Now searching job titles only");
					});
				}
			} else {
				this.$('#job-title-only').removeClass('active');
			}
		},
		triggerJobTitleOnly: function() {
			// activate/deactivate the job title only feature with true/false in the model.
			if (this.model.get('jto')) {
				this.model.set({ jto: false });
			} else {
				this.model.set({ jto: true });
			}
			// triggering the JTO feature will cause another search to be performed automatically.
			this.filterSearch();
		},
		saveSearch: function() {
			var that = this,
				user = this.userModel,
				collection = this.options.alertsCollection,
				ssQuery = this.model.get('keyword').toProperCase(),
				ssLocation = this.model.get('location').formatLocation(),
				saveSearchData = {
					keyword: ssQuery,
					location: ssLocation
				};
				// console.log(collection.length);
			// check if the user is missing a token and make sure the location field isnt empty
			if (!user.get("token")) {
				if (collection.length < 1 && user.get("email")) {
					console.log('ADDING AS A CONFIRMED');
					collection.add(saveSearchData);
				} else {
					require(['modules/modaloverlay/modalView', 'modules/socialView'], function(Modal, Social) {
						var modal = new Modal.LoginView({
							userModel: user,
							app: that.app,
							searchModel: that.model,
							data: saveSearchData
						});
						that.app.modal.show(modal);
						new Social.View({
							el: "#socialModal",
							model: that.model,
							data: saveSearchData
						});
					});
				}
			} else {
				// at this point, the user has something in the location input
				// they are also logged in as a registered user
				if (collection.length < 25) {
					if (ssLocation !== '') {
						console.log('ADDING AS A CONFIRMED +');
						collection.add({
							keyword: ssQuery,
							location: ssLocation
						});
					} else {
						// if the location field is empty
						require(['modules/tooltip'], function(Tooltip) {
							Tooltip.show("To create this alert, your search must include a location.");
						});
						return false;
					}
				} else {
					require(['modules/tooltip'], function(Tooltip) {
						Tooltip.show("You've reached the 25 Alert Limit.");
					});
				}
			}
		},
		initMobileDigest: function() {
			// Check if the client is on a mobile device and make sure we have their email.
			if (isMobile && this.userModel.get('email')) {
				// Initiate the Mobile Digest element
				this.$('#mobile-digest').show();
				if (this.userModel.get('mobileDigest')) {
					this.$('#mobile-digest').addClass('active');
				}
			} else {
				this.$('#mobile-digest').hide();
			}
		},
		triggerMobileDigest: function() {
			// Check the model for the status of the mobile digest property.
			// Then enable or disable the mobile digest feature.
			if (this.userModel.get('mobileDigest')) {
				this.userModel.set({
					mobileDigest: false
				});
				$('#mobile-digest').removeClass('active');
			} else {
				this.userModel.set({
					mobileDigest: true
				});
				$('#mobile-digest').addClass('active');
			}
			// Change the mobile digest status for this user on the server.
			$.jsonp({
				url: location.protocol + "//api." + location.hostname + "/server/mobileDigest/",
				callbackParameter: "callback",
				data: {
					user_id: this.userModel.get('_id'),
					mobile_digest: this.userModel.get('mobileDigest')
				}
			});
		},
		renderListView: function() {
			// If not mobile, initiate list view
			if (!isMobile) {
				$('#list-view').show();
				if (this.model.get('listView')) {
					$('#list-view').removeClass('active');
					$('.toggle-description').removeClass('show');
					$('.table-description').hide();
				} else {
					$('#list-view').addClass('active');
					$('.toggle-description').addClass('show');
					$('.table-description').show();
				}
			} else {
				$('#list-view').hide();
			}
		},
		triggerListView: function() {
			// The list view is a feature that shows/hides the job description.
			// the list view button triggers the description on all jobs in the results set.
			if (this.model.get('listView')) {
				this.model.set({
					listView: false
				});
			} else {
				this.model.set({
					listView: true
				});
			}
			console.log('SEARCH MODEL LIST VIEW:', this.model.get('listView'));
		},
		tooltips: function() {
			this.$(".subnav-item li").hover(function() {
				$(this).find(".subnav-item-tt").show();
			},function() {
				$(this).find(".subnav-item-tt").hide();
			});
			this.$('#job-title-only').css('border-right','none');
		}
	});

	//Results Count view
	SubApp.ResultsCountView = Marionette.ItemView.extend({
		template: templates.resultsCount,
		modelEvents: {
			"change": "modelChanged"
		},
		modelChanged: function() {
			this.render();
		},
		onRender: function() {
			if (this.model.get('numResults') === '0') {
				$(this.$el).hide();
			} else {
				$(this.$el).show();
			}
		}
	});

	//Pagination view
	SubApp.PaginationView = Marionette.ItemView.extend({
		initialize: function(options) {
			this.model = options.model;
			this.app = options.app;
			// page
			this.p = parseInt(this.model.defaults.page, 10);
		},
		template: templates.pagination,
		modelEvents: {
			'change': 'modelChanged'
		},
		events: {
			'click a.prev': 'gotoPrev',
			'click a.next': 'gotoNext',
			'click a.page': 'gotoPage'
		},
		modelChanged: function() {
			this.render();
		},
		onRender: function() {
			if (this.model.get('numResults') === '0') {
				$(this.$el).hide();
			} else {
				$(this.$el).show();
			}
		},
		gotoPrev: function (e) {
			e.preventDefault();
			this.p = parseInt(this.model.get('page'),10) - 1;
			this.doSearch();
		},
		gotoNext: function (e) {
			e.preventDefault();
			this.p = parseInt(this.model.get('page'),10) + 1;
			this.doSearch();
		},
		gotoPage: function (e) {
			e.preventDefault();
			this.p = $(e.target).text();
			this.doSearch();
		},
		doSearch: function() {
			var queryUrl = '',
				q = jobTitleCheck(this.model.get('keyword'), this.model).formatQuery(),
				l = this.model.get('location').formatQuery();
			console.log('q value:', q);
			console.log('l value:', l);
			console.log('p value:', this.p);
			if (this.model.get('radius') !== this.model.defaults.radius || this.model.get('daysBack') !== this.model.defaults.radius) {
				queryUrl = 'jobs/' + q + '/' + l + '/' + this.p  + '/' + this.model.get('radius') + '/' + this.model.get('daysBack');
			} else {
				queryUrl = 'jobs/' + q + '/' + l + '/' + this.p;
			}
			this.app.navigate(queryUrl, {trigger: true});
		}
	});

	//Job view
	SubApp.JobView = Marionette.ItemView.extend({
		template: templates.job,
		tagName: 'article',
		className: 'job',
		events: {
			'click .toggle-description': 'toggleDescription',
			'click h2 a': 'resultClick'
		},
		initialize: function(options) {
			if (isMobile) {
				this.mobileDigest = options.mobileDigest;
			}
			this.listView = options.searchModel.get('listView');
		},
		onRender: function() {
			if (isMobile) {
				this.$('a').attr('target', '_top');
			}
		},
		onShow: function() {
			if (this.listView) {
				this.$('.table-description').hide();
			}
		},
		initDescription: function() {
			if (!this.listView) {
				this.$('.toggle-description').addClass('show');
			}
		},
		toggleDescription: function(e) {
			e.preventDefault();
			if ($(e.currentTarget).hasClass('show')) {
				$(e.currentTarget).removeClass('show');
				this.$('.table-description').hide();
			} else {
				$(e.currentTarget).addClass('show');
				this.$('.table-description').show();
			}
		},
		resultClick: function(e) {
			// Check mobile activity
			//console.log('Mobile Activity:', this.mobileDigest.get('status'));

			// Metrics collect for result click
			$.jsonp({
				url: location.protocol + "//api." + location.hostname + "/metrics/resultClick/",
				callbackParameter: "callback",
				data: {
					search_id:this.options.searchModel.get('_id'),
					result_key:this.model.get('jobKey'),
					result_title:this.model.get('jobTitle'),
					result_company:this.model.get('company'),
					result_location:this.model.get('formattedLoc'),
					result_age:this.model.get('wasAdded'),
					result_position:$('.job').index($(e.target).parents('.job')) + 1,
					result_type:this.model.get('type')
				}
			});
		}
	});

	//Results view
	SubApp.ResultsView = Marionette.CollectionView.extend({
		initialize: function(options) {
			this.searchModel = options.searchModel;
			if (isMobile) {
				var MobileDigest = Backbone.Model.extend();
				this.mobileDigest = new MobileDigest({ status: options.userModel.get('mobileDigest') });
				this.listenTo(options.userModel, "change:mobileDigest", this.triggerMobileDigest);
			}
		},
		modelEvents: {
			'change':'getItemView'
		},
		emptyView: Loading.ResultsView,
		getItemView: function() {
			if (this.searchModel.get('numResults') !== "0") {
				return SubApp.JobView;
			} else {
				return NoJobs.View;
			}
		},
		tagName: 'section',
		itemViewOptions: function() {
			if (isMobile) {
				return {
					searchModel: this.searchModel,
					mobileDigest: this.mobileDigest
				};
			} else {
				return {
					searchModel: this.searchModel
				};
			}
		},
		triggerMobileDigest: function() {
			if (this.mobileDigest.get('status')) {
				this.mobileDigest.set({ status: false });
			} else {
				this.mobileDigest.set({ status: true });
			}
		}
	});

	var NoJobs = {};
	// No Results view
	NoJobs.View = Marionette.ItemView.extend({
		initialize: function(options) {
			this.model = options.searchModel;
		},
		template: templates.noJobs,
		className: 'noJob',
		modelEvents: {
			"change":"modelChanged"
		},
		modelChanged: function() {
			this.render();
		},
		onRender: function() {
			var adLocation = (this.model.get('location') || $.cookie('user_location')),
				adOptions = {
					keyword: this.model.get('keyword'),
					page: this.model.get('page'),
					loc: adLocation
				},
				numResults = this.model.get('numResults');
			console.log('SHOWING NO JOBS');
			require(['modules/media/jrpadHandler'], function(Ad) {
				Ad.resultsPage(adOptions, numResults);
			});
		}
	});

	console.log('success loading results Views');

	return SubApp;
});
