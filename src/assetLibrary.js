
module.exports = AssetLibrary;

function AssetLibrary() {

  var types = {};

  var byId = {};

  var byName = {};

  function nextId(type) {
    return type + "-" + types[type].nextId++;
  }

  this.addType = function(type, model) {
    types[type] = {
      nextId: 0,
      model: model
    };
    byId[type] = {};
    byName[type] = {};
  };

  this.getTypes = function() {
    return Object.keys(types);
  };

  this.getType = function(type) {
    return types[name];
  };

  this.add = function(type, def) {
    // TODO validate
    def.info.id = nextId(type);
    byId[type][def.info.id] = def;
    byName[type][def.info.name] = def;
  };

  this.update = function(type, def) {

    var oldDef = byId[type][def.info.id];
    delete byName[type][oldDef.info.name];

    byId[type][def.info.id] = def;
    byName[type][def.info.name] = def;
  };

  this.delete = function(type, id) {
    var toDelete = byId[type][id];
    delete byName[type][toDelete.info.name];
    delete byId[type][id];
  };

  this.idList = function(type) {
    return Object.keys(byId[type]);
  };

  this.getById = function(type, id) {
    return byId[type][id];
  };

  this.getByName = function(type, name) {
    return byName[type][name];
  };

  this.find = function(type, searchString) {
  };
}
