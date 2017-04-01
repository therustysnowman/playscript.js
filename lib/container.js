
var Util = require('./util');

module.exports = {
  init: function(callbacks) {
    return create({}, callbacks);
  },
  load: function(definition, callbacks) {
    return create(definition, callbacks);
  }
};

function create(definition, callbacks) {

  var _callbacks = {
    loaded: Util.defaultVal(callbacks.loaded, Util.noop)
  }

  var _assetLibrary = {};
  var _sceneStore = {};

  function load() {
    _callbacks.loaded();
  }

  var _interface = {
    getAssetLibrary: function() {
      return _assetLibrary;
    },
    getSceneStore: function() {
      return _sceneStore;
    },
    /* create a deep copy */
    clone: function() {},
    export: function() {}
  };

  setTimeout(load, 0);

  return _interface;
}
