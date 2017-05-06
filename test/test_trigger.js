var expect = require('chai').expect;
var Trigger = require('../src/trigger');

function Emitter(id) {

  var _trigger = Trigger.addTriggerInterface(this);

  this.id = id;

  this.fire = function(eventName) {
    _trigger.fire.apply(this, arguments);
  }

  this.clear = function() {
    _trigger.clear();
  }
}

var emitterA = new Emitter("A");
var emitterB = new Emitter("B");

describe('trigger', function() {

  beforeEach(function() {
    emitterA.clear();
    emitterB.clear();
  });

  it('simple event', function() {
    var called = 0;
    var consumer = {
      event: function(event) {
        called++;
        expect(event).to.have.a.property("source").that.equals(emitterA);
      }
    };
    emitterA.addListener(consumer);
    emitterA.fire("event");
    expect(called).to.equal(1);
  });

  it('multiple arguments', function() {
    var called = calledA2 = 0;
    var consumer = {
      event: function(event, arg1, arg2) {
        called++;
        expect(arg1).to.equal("arg1Val");
        expect(arg2).to.equal("arg2Val");
      }
    };
    emitterA.addListener(consumer);
    emitterA.fire("event", "arg1Val", "arg2Val");
    expect(called).to.equal(1);
  });

  it('multiple event types', function() {
    var calledA1 = calledA2 = 0;
    var consumer = {
      eventA: function() {
        calledA1++;
      },
      eventB: function() {
        calledA2++;
      }
    };
    emitterA.addListener(consumer);
    emitterA.fire("eventA");
    emitterA.fire("eventB");
    expect(calledA1).to.equal(1);
    expect(calledA2).to.equal(1);
  });

  it('multiple consumers', function() {
    var calledA = calledB = 0;
    var consumerA = {
      event: function() {
        calledA++;
      }
    };
    var consumerB = {
      event: function() {
        calledB++;
      }
    };
    emitterA.addListener(consumerA);
    emitterA.addListener(consumerB);
    emitterA.fire("event");
    expect(calledA).to.equal(1);
    expect(calledB).to.equal(1);
  });

  it('no cross talk between emitters', function() {
    var calledA = calledB = 0;
    var consumerA = {
      event: function() {
        calledA++;
      }
    };
    var consumerB = {
      event: function() {
        calledB++;
      }
    };
    emitterA.addListener(consumerA);
    emitterB.addListener(consumerB);
    emitterA.fire("event");
    emitterB.fire("event");
    expect(calledA).to.equal(1);
    expect(calledB).to.equal(1);
  });

  it('can remove consumers', function() {
    var calledA1 = calledA2 = calledA3 = calledB = 0;
    var consumerA1 = { event: function() { calledA1++; } };
    var consumerA2 = { event: function() { calledA2++; } };
    var consumerA3 = { event: function() { calledA3++; } };
    var consumerB = { event: function() { calledB++; } };
    emitterA.addListener(consumerA1);
    emitterA.addListener(consumerA2);
    emitterA.addListener(consumerA3);
    emitterB.addListener(consumerB);
    emitterA.fire("event");
    emitterB.fire("event");
    expect(calledA1).to.equal(1);
    expect(calledA2).to.equal(1);
    expect(calledA3).to.equal(1);
    expect(calledB).to.equal(1);
    emitterA.removeListener(consumerA2);
    emitterA.fire("event");
    emitterB.fire("event");
    expect(calledA1).to.equal(2);
    expect(calledA2).to.equal(1);
    expect(calledA3).to.equal(2);
    expect(calledB).to.equal(2);
    emitterA.removeListener(consumerA1);
    emitterA.fire("event");
    emitterB.fire("event");
    expect(calledA1).to.equal(2);
    expect(calledA2).to.equal(1);
    expect(calledA3).to.equal(3);
    expect(calledB).to.equal(3);
  });

  it('can clear consumers', function() {
    var calledA1 = calledA2 = calledA3 = calledB = 0;
    var consumerA1 = { event: function() { calledA1++; } };
    var consumerA2 = { event: function() { calledA2++; } };
    var consumerA3 = { event: function() { calledA3++; } };
    var consumerB = { event: function() { calledB++; } };
    emitterA.addListener(consumerA1);
    emitterA.addListener(consumerA2);
    emitterA.addListener(consumerA3);
    emitterB.addListener(consumerB);
    emitterA.fire("event");
    emitterB.fire("event");
    expect(calledA1).to.equal(1);
    expect(calledA2).to.equal(1);
    expect(calledA3).to.equal(1);
    expect(calledB).to.equal(1);
    emitterA.clear();
    emitterA.fire("event");
    emitterB.fire("event");
    expect(calledA1).to.equal(1);
    expect(calledA2).to.equal(1);
    expect(calledA3).to.equal(1);
    expect(calledB).to.equal(2);
  });

});
