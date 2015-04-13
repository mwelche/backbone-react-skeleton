var Route = function(app, user){
	require(["homeController", "jobsController"], function(HomeController, JobsController){
		//home page route
		app.HomeRouting = function(){
			var HomeRouting = {};

			HomeRouting.Router = Marionette.AppRouter.extend({
				appRoutes: {
					'(home)(/)': 'home'
				}
			});

			app.addInitializer(function(){
				var myUser = new user.Model({id: 1});
				myUser.fetch();
				console.log("myUser in local storage:", myUser);
					HomeRouting.router = new HomeRouting.Router({
					    controller: new HomeController({
						app: app,
						model: myUser
					    })
				    });
				    
				    console.log('Home routing initialized!');
			});

			return HomeRouting;
		}();

		//job search route
		app.JobsRouting = function(){
			var JobsRouting = {};

			JobsRouting.Router = Marionette.AppRouter.extend({
				appRoutes: {
					'jobs(/:q)(/:l)(/:p)(/:r)(/:d)(/:jk)(/)': 'searchQuery',
				}
			});

			app.addInitializer(function(){
				var myUser = new user.Model({id: 1});
				myUser.fetch();
				console.log("myUser in local storage:", myUser);
					JobsRouting.router = new JobsRouting.Router({
					    controller: new JobsController({
						app: app,
						model: myUser
					    })
				    });
				    
				    console.log('Jobs routing initialized!');
			});

			return JobsRouting;
		}();

		app.vent.trigger('routing:started');
	});
};
