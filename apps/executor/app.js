/* globals document */

var Playscript = require('../../lib/playscript');

var executorHtml = require('./executor.html');

require('./style.scss');

module.exports = function() {
  document.getElementsByTagName('body')[0].innerHTML = executorHtml;
  Playscript.execute(document.getElementsByClassName('ps-stage')[0], {});
};
