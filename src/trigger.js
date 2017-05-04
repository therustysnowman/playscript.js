/* global module */

module.exports = {
    createTrigger: createTrigger
};

function createTrigger(obj) {

  var _listeners = [];

  obj.addListener = function(listener) {
    _listeners.push(listener);
  }

  obj.removeListener = function(listener) {
    var index;
    while ((index = _listeners.indexOf(listener)) > -1) {
      _listeners.splice(index, 1);
    }
  }

  return {
    clear: function() {
      _listeners = [];
    },
    fire: function(eventName) {
      var args = Array.prototype.slice.call(arguments, 1);
      args.unshift({ source: obj });
      _listeners.forEach(function(listener) {
        if (typeof listener[eventName] === "function") {
          listener[eventName].apply(listener, args);
        }
      });
    }
  };
}
