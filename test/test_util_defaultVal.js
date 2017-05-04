var assert = require('chai').assert;
var defaultVal = require('../src/util').defaultVal;

var notDefined;

describe('util', function() {
  describe('default', function() {
    it('should return default value when undefined provided', function() {
      assert.equal(defaultVal(notDefined, "defaultValue"), "defaultValue");
    });
  });
});
