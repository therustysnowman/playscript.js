

var Definitions  = require("./definitions").constructor;
var Enum         = require("./enum.js").constructor;
var ConfigLoader = require("./configLoader.js").constructor;
var Modelling    = require("./modelling.js");
var Logger       = require("./logger.js");
var TimerStore   = require("./timerStore.js").constructor;
var Trigger      = require("./trigger.js");
var Util         = require("./util.js");

var MODULE = "Playscript";

var STATE = new Enum([
  "NONE", "LOADING", "LOADED", "PAUSED", "RUNNING", "ENDED"
]);

var MODEL = {
    params: {
        type: "container",
        content: {
            fps: { type: "integer", default: 60 },
            start: {
                type: "container",
                content: {
                    scene: { type: "string", default: "" },
                    transition: { type: "string", default: "" }
                }
            }
        }
    },
    hooks: {
        type: "container",
        content: {
            onCreate: { type: "function", default: Util.noop },
            onResize: { type: "function", default: Util.noop },
            onTick: { type: "function", default: Util.noop },
            getResult: { type: "function", default: Util.noop }
        }
    },
    data: { type: "dataset" , default: {} },
    funcs: { type: "functionSet", default: {} }
};

var DEFAULTS = Modelling.extractDefaults(MODEL);

function Playscript() {

  var _trigger = Trigger.addTriggerInterface(this);

  var _state;

  var _def;

  var _definitions;
  var _gameAnimationFrame;
  var _timers;

  var framesUntilFPSCapture = 60;
  var lastStatTimestamp = performance.now();
  var lastFrameTimestamp = performance.now();
  var _fps = 60;

  var _scenes;
  var _currentScene;

  var _canvas;

  // Initialise PIXI render
  var _renderer;

  var _cfgLoader = new ConfigLoader({
    loaded: function(file, config) {
      _processConfig(config);
    },
    complete: function() {
      _init();
    }
  });

  // Public functions //////////////////////////////////////////////////////////

  this.load = _load;
  this.resume = _resume;
  this.pause = _pause;

  this.definitions = function() {
    return _definitions;
  }

  // Private functions /////////////////////////////////////////////////////////

  function _reset() {
    _state = STATE.NONE;

    if (!Util.isUndefined(_timers)) {
      _timers.clear();
    }

    _definitions = new Definitions();
    _timers = new TimerStore();
    _def = Util.clone(DEFAULTS);
    _cfgLoader.cancel();
    window.cancelAnimationFrame(_gameAnimationFrame);
    _canvas = null;
    _scenes = {};
    _currentScene = null;

    _renderer = null;
  }

  function _load(opt) {

    _reset();

    _state = STATE.LOADING;

    /*_renderer = PIXI.autoDetectRenderer(
     _canvas.clientWidth-100, _canvas.clientHeight-100, {
       view: _canvas
     }
   );
   _renderer.view.style.position = 'absolute';
   _renderer.view.style.display = 'block';
   _renderer.autoResize = true;*/

    if (typeof opt.config === "string") {
        _cfgLoader.load(opt.config);
    } else if (typeof opt.config === "object") {
        _processConfig(opt.config);
    } else {
        Logger.error(MODULE, "_load",
          "'config' must be provided as an object or string");
    }
  }

  function _processConfig(config) {

    if (_state !== STATE.LOADING) {
      Logger.error(MODULE, "_loadConfig",
        "Must be in state LOADING, not '" + _state + "'");
    } else {

      // Perform file processing

      if (_cfgLoader.complete()) {
        _init();
      }
    }
  }

  function _init() {

    if (_state !== STATE.LOADING) {
      Logger.error(MODULE, "_loadConfig",
        "Must be in state LOADING, not '" + _state + "'");
    } else {

      // Load


      // Transition

      _state = STATE.LOADED;

      _resume();
    }
  }

  function _resume() {
    if (_state !== STATE.LOADED &&
        _state !== STATE.PAUSED) {
      return;
    }
    _state = STATE.RUNNING;
    /*if (!_currentScene) {
        _switchScene(_def.start.scene, _def.start.transition);
    } else {
        _currentScene.resume();
    }*/
    _timers.resume();
    _trigger.fire("resumed");
    _gameAnimationFrame = window.requestAnimationFrame(_tick);
  }

  function _pause() {
    if (_state !== STATE.RUNNING) {
      return;
    }
    _state = STATE.PAUSED;
    window.cancelAnimationFrame(_gameAnimationFrame);
    _timers.pause();
    this.fire("paused");

  }

  function _end() {
    _state = STATE.ENDED;
    window.cancelAnimationFrame(_gameAnimationFrame);
    _timers.pause();
    this.fire("ended"); // TODO retrieve result
  }

  function _tick(frameTimestamp) {
    _gameAnimationFrame = window.requestAnimationFrame(_tick);
    Logger.info(MODULE, "_tick", "Game tick");
  }

  function _switchScene(scene, transition) {

  }
};

module.exports = new Playscript();
