
module.exports = Executor;

var Enum = require('./enum.js').constructor;
var LoadingScene = require('./loadingScene.js').constructor;

var loadContainer = require('./container.js').load;

var STATE = new Enum([
  'LOADING',
  'LOADED',
  'PAUSED',
  'RUNNING',
  'ENDED'
]);

function Executor(canvas, definition, callbacks, opts) {

  var _state = STATE.LOADING;
  var _scene = LoadingScene;

  var _canvas = canvas;

  // Initialise PIXI render
  var _renderer = PIXI.autoDetectRenderer(
    _canvas.clientWidth-100, _canvas.clientHeight-100, {
      view: _canvas
    });
  _renderer.view.style.position = 'absolute';
  _renderer.view.style.display = 'block';
  _renderer.autoResize = true;

  var _playscript = loadContainer(definition, {
    loaded: function() {
      console.log('Loaded');
      _initialise();
    }
  });

  function _initialise() {
    console.log('Start');
    _tick();
  }

  function _tick() {
    requestAnimationFrame(_tick);
    _scene.tick();
    _renderer.resize(window.innerWidth, window.innerHeight);
    _scene.render(_renderer);
  }

  // Public interface

  this.resume = function() {
    console.log('resume');
  };

  this.pause = function() {
    console.log('pause');
  }
}
