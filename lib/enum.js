/* global module */

module.exports = {
  create: create
};

function create(items) {

  items = items || [];

  var interface = {};

  interface.contains = function(item) {
    return interface.hasOwnProperty(item);
  };

  items.forEach(function(item) {
    if (typeof item === 'string') {
      interface[item] = item;
    }
  });

  return interface;
}
