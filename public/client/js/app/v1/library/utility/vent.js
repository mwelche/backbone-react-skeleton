// Enable the ability to have event aggregators anywhere! (but not 
// attached to the app object ;)

define(['backbone.wreqr'],function(Wreqr){
  return new Wreqr.EventAggregator();
})

// Usage
/* define(['vent'], function(vent) {
  vent.on('eventName', function(){});
  vent.trigger('eventName');
}) */