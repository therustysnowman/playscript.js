
module.exports = {
  create: create
};

var createEnum = require('./enum.js').create;
var LoadingScene = require('./loadingScene.js');
var loadContainer = require('./container.js').load;

var STATE = createEnum([
  'LOADING',
  'LOADED',
  'PAUSED',
  'RUNNING',
  'ENDED'
]);

function create(canvas, definition, callbacks, opts) {

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
  _resize();

  //window.onresize = _resize;

  function _resize() {
    _renderer.resize(window.innerWidth, window.innerHeight);
  }

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

  var _interface = {
    resume: function() {
      console.log('resume');
    },
    pause: function() {
      console.log('pause');
    }
  }
}