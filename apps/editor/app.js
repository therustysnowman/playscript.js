/* globals document */

var Playscript = require('../../lib/playscript');

var editorHtml = require('./editor.html');
var loadingHtml = require('./loading.html');

require('./style.scss');

function loaded() {
    document.getElementsByTagName('body')[0].innerHTML = editorHtml;
}

module.exports = function() {
  document.getElementsByTagName('body')[0].innerHTML = loadingHtml;
  Playscript.init({
    loaded: loaded
  })
};
