

module.exports = {
  constructor: LoadingScene
};

var PIXI = require('pixi.js');

function LoadingScene() {

  var stage = new PIXI.Container();

  var playScriptLine = new PIXI.Text(
    'PlayScript',
    {
      fontFamily : 'Arial',
      fontSize: 48,
      fill : 0xffffff,
      align : 'center'
    }
  );
  playScriptLine.anchor.set(0.5, 0.5);
  stage.addChild(playScriptLine);

  var byLine = new PIXI.Text(
    'by The Rusty Snowman',
    {
      fontFamily : 'Arial',
      fontSize: 16,
      fill : 0xffffff,
      align : 'center'
    }
  );
  byLine.anchor.set(0.5, 0.5);
  byLine.alpha = 0.6;
  stage.addChild(byLine);

  var alpha = 1.0;
  var alphaInc = 0.01;

  this.tick = function() {
  };

  this.render = function(renderer) {

    alpha -= alphaInc;
    if (alpha <= 0.3 || alpha >= 1) {
      alphaInc = alphaInc * -1;
    }
    playScriptLine.alpha = alpha;

    var halfW = renderer.width / 2;
    var halfH = renderer.height / 2;

    playScriptLine.position.set(halfW, halfH - 20);
    byLine.position.set(halfW, renderer.height - 20);

    renderer.render(stage);
  }
}
