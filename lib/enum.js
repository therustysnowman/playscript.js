/* global module */

module.exports = {
  constructor: Enum
};

function Enum(items) {

  var that = this;

  this.contains = function(item) {
    return that.hasOwnProperty(item);
  };

  (items || []).forEach(function(item) {
    if (typeof item === 'string') {
      that[item] = item;
    }
  });
}
