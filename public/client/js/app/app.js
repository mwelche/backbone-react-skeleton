// js/app.js
console.log('App.js Loaded!');
define(["marionette", "controller", "user"], function(Marionette, Controller, User) {
  // initialize marionette application
  var App = new Marionette.Application();

  //app initialization
  App.addRegions({
    content: '#main-content',
    modal: ModalRegion
  });

  App.navigate = function(route, options) {
    options = options || {};
    Backbone.history.navigate(route, options);
  };

  App.getCurrentRoute = function() {
    return Backbone.history.fragment;
  };

  App.Router = Marionette.AppRouter.extend({
    appRoutes: {
      'home': 'home',
      '*actions': 'home'
    }
  });

  // Instantiate models
  var myUser = new User.Model({id: 1});
    // user model
    myUser.fetch();
    App.UserModel = myUser;

  App.on('initialize:after', function() {
    if (Backbone.history) {
      Backbone.history.start({
        //pushState:true
      });
      console.log('history has started');
      console.log('get Route: ', this.getCurrentRoute());
    }
  });

  App.addInitializer(function() {
    console.log('start initializer');
    var controller = new Controller({
      app: App
    });
    new App.Router({
      controller: controller
    });
    console.log(window);
    console.log('instantiate router');
  });

  return App;
});
