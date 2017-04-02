
module.exports = {
  create: create
}

require('./style.scss');
var html = require('./template.html');

function create(title, content, controls) {

  var _dialog = document.createElement("div");
  _dialog.classList.add("ps-dialog");
  _dialog.innerHTML = html;

  _dialog.querySelector(".js-dialog-title").textContent = title;

  _dialog.querySelector(".js-dialog-content").appendChild(content);

  var controlsDiv = _dialog.querySelector(".js-dialog-controls");
  controls.forEach(function(control) {
    var btn = document.createElement("button");
    btn.textContent = control.label;
    btn.addEventListener("click", control.callback);
    controlsDiv.appendChild(btn);
  })

  document.body.appendChild(_dialog);

  return {
    close: function() {
      document.body.removeChild(_dialog);
    }
  };
}
