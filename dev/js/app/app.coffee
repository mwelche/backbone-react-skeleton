# js/app.js

console.log 'App.js Loaded!'
define ['marionette', 'controller', 'user'], (Marionette, Controller, User) ->

  # initialize marionette application
  App = new (Marionette.Application)

  ###
  # REGIONS ARE MARIONETTE
  #app initialization
  App.addRegions
    content: '#main-content'
  ###

  App.navigate = (route, options) ->
    options = options or {}
    Backbone.history.navigate route, options
    return

  App.getCurrentRoute = ->
    Backbone.history.fragment

  App.Router = Marionette.AppRouter.extend(
    appRoutes:
      '(/)': 'home'
      '*actions': 'home'
  )

  # Instantiate models
  myUser = new User.Model(id: 1)
  # user model
  myUser.fetch()
  App.UserModel = myUser

  App.on 'start', ->
    console.log 'ON app start'
    if Backbone.history
      Backbone.history.start({
        # pushState: true
      })
      console.log 'history has started'
      console.log 'get Route: ', @getCurrentRoute()
    return

  console.log 'start initializer'
  
  controller = new Controller(app: App)
  new App.Router(controller: controller)
    
  console.log window
  console.log 'instantiate router'
  
  App