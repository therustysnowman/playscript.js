
var Util = require('./util');
var createTrigger = require("./trigger").createTrigger;

module.exports = {
  init: function(callbacks) {
    return create({}, callbacks);
  },
  load: function(definition, callbacks) {
    return create(definition, callbacks);
  }
};

function Container(definition) {

  // Private variables

  var _assetLibrary = {};
  var _sceneStore = {};
  var _trigger = createTrigger(this, "ps-container");

  // Private functions

  function _load() {
    _trigger.trigger("loaded");
    _callbacks.loaded();
  }

  // Public interface

  this.getAssetLibrary = function() {
    return _assetLibrary;
  };

  this.getSceneStore = function() {
    return _sceneStore;
  };

  // Initialisation

  setTimeout(load, 0);
}
