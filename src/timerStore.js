/* global module */

module.exports = {
    constructor: TimerStore
};

function TimerStore() {

  // Private variables /////////////////////////////////////////////////////////

  var _nextId = 1;

  var _elapsed;
  var _lastTime;

  var _byId;
  var _byName;

  var _queue;

  // Initialisation ////////////////////////////////////////////////////////////

  _reset();

  // Public functions //////////////////////////////////////////////////////////

  // delay is in milliseconds
  this.add = function(delay, func, name) {

    var id = _nextId++;
    var triggerTime = _elapsed + delay;

    _byId[id] = {
      delay: delay,
      triggerTime: triggerTime,
      func: func,
      name: null
    };

    if (typeof name !== "undefined" && typeof _byName[name] === "undefined") {
      _byId[id].name = name;
      _byName[name] = id;
    }

    var inserted = false;
    for (var i=0; !inserted && i < _queue.length; i++) {
      if (triggerTime < _byId[_queue[i]].triggerTime) {
        _queue.splice(i, 0, id);
        inserted = true;
      }
    }
    if (!inserted) {
      _queue.push(id);
    }
  };

  this.cancelById = function(id) {
    _cancelById(id);
  };

  this.cancelByName = function(name) {
    if (typeof _byName[name] !== "undefined") {
      _cancelById(_byName[name]);
    }
  };

  this.clear = function() {
    _reset();
  };

  this.pause = function() {
      // nothing
  };

  this.resume = function() {
    _lastTime = Date.now();
  };

  this.tick = function() {

    // Tick time
    var thisTime = Date.now();
    _elapsed += (thisTime - _lastTime);
    _lastTime = thisTime;

    var done = false;
    while (!done) {
      if (_queue.length > 0) {
        if (_byId[_queue[0]].triggerTime <= _elapsed) {
          _byId[_queue[0]].func();
          _queue.splice(0, 1);
        } else {
          done = true;
        }
      } else {
        done = true;
      }
    }
  };

  // Private functions /////////////////////////////////////////////////////////

  function _reset() {
    _lastTime = Date.now();
    _elapsed = 0;
    _byId = {};
    _byName = {};
    _queue = [];
  }

  function _cancelById(id) {
    if (typeof _byId[id] !== "undefined") {
      var idx = _queue.indexOf(id);
      if (idx !== -1) {
        _queue.splice(idx, 1);
      }
      if (_byId[id].name !== null) {
        delete _byName[_byId[id].name];
      }
      delete _byId[id];
    }
  }
}
