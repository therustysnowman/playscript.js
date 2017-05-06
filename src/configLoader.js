
var Trigger = require("./trigger.js");

module.exports = {
  constructor: ConfigLoader
};

function _ajaxObject(file, callback) {

  var xmlhttp;
  if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
  } else {
    // code for IE6, IE5
    throw "XMLHttpRequest not supported in this browser";
  }
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState==4 && xmlhttp.status==200) {
      eval(xmlhttp.responseText);
      if (config) {
        callback(file, config);
      } else {
        throw new Error("Loaded file doesn't contain config");
      }
    }
  };
  xmlhttp.open("GET", file + "?_=" + (new Date()).getTime(), true);
  xmlhttp.send();
}

function ConfigLoader() {

  var _loadId = 1;
  var _loading = {};
  _loading[_loadId] = {};

  var _trigger = Trigger.addTriggerInterface(this);

  function _loaded(file, config) {
    if (!Util.isUndefined(_loading[_loadId][file])) {
      _trigger.fire("loaded", file, config);
      delete _loading[_loadId][file];
      if (Object.keys(_loading[_loadId]).length === 0) {
        _trigger.fire("complete");
      }
    }
  }

  this.outstanding = function() {
    return Object.keys(_loading[_loadId]);
  };

  this.complete = function() {
    return Object.keys(_loading[_loadId]).length === 0;
  };

  this.load = function(file) {
    _loading[_loadId][file] = 1;
    _ajaxObject(file, _loaded);
  };

  this.cancel = function() {
    _loading[_loadId] = {};
  };
}
