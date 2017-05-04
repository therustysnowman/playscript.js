
var Container = require('./container');
var Executor = require('./executor');

var Definitions = require("./definitions");
var definitions = new Definitions();

module.exports = {
  /* Create and return an empty playscript container */
  init: function(callbacks) {
    return Container.init(callbacks);
  },
  /* Load and return a playscript container */
  load: function(definition, callbacks) {
    return Container.load(definition, callbacks);
  },
  /* Load and execute a playscript */
  execute: function(canvas, definition, opts) {
    return Executor.create(canvas, definition, opts);
  },
  definitions: function() {
    return definitions;
  }
};
