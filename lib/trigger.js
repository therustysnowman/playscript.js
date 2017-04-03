/* global module */

module.exports = {
    createTrigger: createTrigger
};

function createTrigger(obj, eventPrefix) {

  var _listeners = [];

  var _prefix = eventPrefix + ":";

  obj.addListener = function(listener) {
    _listeners.push(listener);
  }

  obj.removeListener = function(listener) {
    while (_listeners.indexOf(listener) > -1) {
      _listeners.splice(1, 1);
    }
  }

  return {
    clear: function() {
      _listeners = [];
    },
    trigger: function(eventName) {
      var callbackName = _prefix + eventName;
      var args = Array.prototype.slice.call(arguments, 1);
      args.unshift({ source: obj });
      _listeners.forEach(function(listener) {
        if (typeof listener[callbackName] === "function") {
          listener[callbackName].apply(listener, args);
        }
      });
    }
  };
}
