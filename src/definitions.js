
module.exports = {
  constructor: Definitions
};

var extend = require("./util.js").extend;

function Definitions() {

  var _defs  = {};

  function _get(type, name) {
    if (_defs[type] && _defs[type][name]) {
      return _defs[type][name];
    } else {
      throw new Error(
        "No asset of type '" + type + "' with name '" + name + "' found."
      );
    }
  }

  function _build(type, def) {
    var ret = {};
    if (typeof def === "string") {
      def = _get(type, def);
    }
    if (typeof def.extends === "string") {
      extend(ret, _build(type, def.extends));
    }
    extend(ret, def);
    if (typeof ret.extends !== "undefined") {
      delete ret.extends;
    }
    return ret;
  }

  this.add = function(type, name, def) {

    if (typeof _defs[type] === "undefined") {
      _defs[type] = {};
    }

    if (typeof _defs[type][name] !== "undefined") {
      throw new Error(
        "Cannot add '" + type +
        "' asset as name '" + name +
        "' is already used."
      );
    }

    _defs[type][name] = def;
  };

  /**
  * opt can be:
  * - the id of an asset
  * - a definition that may (or may not) include opt.info.extends as another
  *   asset to build on top of
  */
  this.get = function(type, opt) {
    return _build(type, opt);
  };
}
