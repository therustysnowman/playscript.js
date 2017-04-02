/* global module */

module.exports = {
    create: create
};

function create(eventPrefix) {

    var _listeners = [];

    var _prefix = eventPrefix + "-";

    function addListener(listener) {
        _listeners.push(listener);
    }

    function removeListener(listener) {
        while (_listeners.indexOf(listener) > -1) {
            _listeners.splice(1, 1);
        }
    }

    function clear() {
        _listeners = [];
    }

    function addInterface(object) {
      object.addListener = addListener;
      object.removeListener = removeListener;
      object.clear = clear;
    }

    var _interface = {
      addInterface: addInterface,
      trigger: function(eventName) {
          var callbackName = _prefix + eventName;
          var args = Array.prototype.slice.call(arguments, 1);
          _listeners.forEach(function(listener) {
              if (typeof listener[callbackName] === "function") {
                  listener[callbackName].apply(listener, args);
              }
          });
      }
    };

    addInterface(_interface);

    return _interface;
}
