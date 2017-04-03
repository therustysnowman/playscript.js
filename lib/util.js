
/**
 * Create a deep copy of the provided object
 */
function _clone(obj) {

  var copy;

  // Handle the 3 simple types, and null or undefined
  if (null === obj || 'object' !== typeof obj) return obj;

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
    copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = _clone(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        copy[attr] = _clone(obj[attr]);
      }
    }
    return copy;
  }

  throw new Error(
    "Unable to copy obj! Its type isn't supported.");
}

function _defaultVal(val, defaultVal) {
  return (typeof val !== 'undefined') ? val : defaultVal;
}

/**
 * Merge items from the source object onto the target. The content of any
 * objects are merged recursively. Any item on both is taken from the source.
 */
function _extend(target, source, filter) {

  target = target || {};
  source = source || {};
  filter = filter || Object.keys(source);

  filter.forEach(function(attr) {

    if (source.hasOwnProperty(attr)) {

      // Both objects then merge
      if (target.hasOwnProperty(attr) &&
      target[attr] instanceof Object &&
      typeof target[attr] !== 'function' &&
      source[attr] instanceof Object &&
      typeof source[attr] !== 'function') {

        _extend(target[attr], source[attr]);

      } else {

        target[attr] = _clone(source[attr]);

      }
    }
  });

  return target;
}

function _isUndefined(variable) {
  return typeof variable === "undefined";
}

function _noop() {
}

module.exports = {
  clone: _clone,
  defaultVal: _defaultVal,
  extend: _extend,
  isUndefined: _isUndefined,
  noop: _noop
};
