define(['marionette'], function(Marionette) {
  
  function goTo(route) {
    var that = this,
      args = arguments;
    $(window).scrollTop() !== 0 && window.scrollTo(0, 0),
    require(["controllers/" + route], function(fn) {
      fn.apply(that, args);
    });
  }

  var Controller = Marionette.Object.extend({
    initialize: function(options) {
      this.app = options.app;
    },
    home: function() {
      goTo.call(this, "home");
    }
  });
  return Controller;
});
