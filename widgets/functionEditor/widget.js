
module.exports = {
  create: create
}

require('./style.scss');

function create(content) {

  var _editor = document.createElement("textarea");
  _editor.classList.add("ps-functionEditor");
  _editor.value = content;

  _editor.addEventListener(["keyup", "change"], function() {
    validate();
  });

  function get() {
    return _editor.value;
  }

  function set(value) {
    _editor.value = value;
  }

  function validate() {
    console.log("Validate: " + get());
  }

  var _interface = {
    validate: validate,
    get: get,
    set: set,
    appendTo: function(container) {
      container.appendChild(_editor);
    }
  };

  return _interface;
}
