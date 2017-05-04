
var Util = require('./util');
var createTrigger = require("./trigger").createTrigger;

module.exports = {
  init: function() {
    return new Container({});
  },
  load: function(definition) {
    return new Container(definition);
  }
};

function Container(definition) {

  // Private variables

  var _assetLibrary = {};
  var _sceneStore = {};
  var _trigger = createTrigger(this);

  // Private functions

  function _load() {
    _trigger.fire("loaded");
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
