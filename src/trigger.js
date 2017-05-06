/* global module */

module.exports = {
    addTriggerInterface: _addTriggerInterface
};

function _addTriggerInterface(obj, prefix) {

  var _listeners = [];
  var _prefix = prefix ? prefix + ":" : "";

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
      var funcName = _prefix + eventName;
      var args = Array.prototype.slice.call(arguments, 1);
      args.unshift({ source: obj });
      _listeners.forEach(function(listener) {
        if (typeof listener[funcName] === "function") {
          listener[funcName].apply(listener, args);
        }
      });
    }
  };
}
