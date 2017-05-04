var expect = require('chai').expect;
var Definitions = require('../src/definitions');

var defs = new Definitions();

var A_BASE = {
  first: {
    a1: "first-a1-base",
    b1: "first-b1-base"
  }
};

var A_EXTENSION = {
  extends: "A_BASE",
  first: {
    a1: "first-a1-ext",
    c1: "first-c1-ext"
  },
  second: {
    a2: "second-a2-ext"
  }
};

var A_UNKNOWN = {
  extends: "_UNKNOWN_"
};

defs.add("TYPE-A", "A_BASE", A_BASE);
defs.add("TYPE-A", "A_EXTENSION", A_EXTENSION);
defs.add("TYPE-A", "A_UNKNOWN", A_UNKNOWN);

describe('definitions', function() {

  beforeEach(function() {
  });

  it('add', function() {
    defs.add("TYPE-A", "ADD_TEST", { item: "value" } );
    var def = defs.get("TYPE-A", "ADD_TEST");
    expect(def).to.have.a.property("item").that.equals("value");
  });

  it('add duplicate', function() {
    expect(function() {
      defs.add("TYPE-A", "A_BASE", A_BASE);
    }).to.throw("Cannot add 'TYPE-A' asset as name 'A_BASE' is already used.");
  });

  it('get by name unknown', function() {
    expect(function() {
      defs.get("TYPE-A", "_UNKNOWN_");
    }).to.throw("No asset of type 'TYPE-A' with name '_UNKNOWN_' found.");
  });

  it('get by name without extends', function() {

    var def = defs.get("TYPE-A", "A_BASE");

    expect(def).to.deep.equal({
      first: {
        a1: "first-a1-base",
        b1: "first-b1-base"
      }
    });
  });

  it('get by name with extends', function() {

    var def = defs.get("TYPE-A", "A_EXTENSION");

    expect(def).to.deep.equal({
      first: {
        a1: "first-a1-ext",
        b1: "first-b1-base",
        c1: "first-c1-ext"
      },
      second: {
        a2: "second-a2-ext"
      }
    });
  });

  it('get by name with unknown extends in chain', function() {
    expect(function() {
      defs.get("TYPE-A", "A_UNKNOWN");
    }).to.throw("No asset of type 'TYPE-A' with name '_UNKNOWN_' found.");
  });

  it('get by definition without extends', function() {

      var def = defs.get("TYPE-A", {
        first: {
          z1: "first-z1-def"
        },
        second: {
          z2: "second-z2-def"
        }
      });

      expect(def).to.deep.equal({
        first: {
          z1: "first-z1-def"
        },
        second: {
          z2: "second-z2-def"
        }
      });
  });

  it('get by definition with extends', function() {

    var def = defs.get("TYPE-A", {
      extends: "A_EXTENSION",
      first: {
        a1: "first-a1-def",
        d1: "first-d1-def"
      },
      second: {
        a2: "second-a2-def",
        b2: "second-b2-def"
      },
      third: {
        a3: "third-a3-def"
      }
    });

    expect(def).to.deep.equal({
      first: {
        a1: "first-a1-def",
        b1: "first-b1-base",
        c1: "first-c1-ext",
        d1: "first-d1-def"
      },
      second: {
        a2: "second-a2-def",
        b2: "second-b2-def"
      },
      third: {
        a3: "third-a3-def"
      }
    });
  });

  it('get by definition with unknown extends', function() {
    expect(function() {
      defs.get("TYPE-A", { extends: "_UNKNOWN_" } );
    }).to.throw("No asset of type 'TYPE-A' with name '_UNKNOWN_' found.");
  });

});
