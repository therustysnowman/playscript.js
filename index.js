
var playscript = require("./src/playscript.js");

module.exports = {
  play: function(opt) {
    playscript.load(opt);
  },
  pause: function() {
    playscript.pause();
  },
  resume: function() {
    playscript.resume();
  }
};
