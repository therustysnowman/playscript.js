
function _defaultVal(val, defaultVal) {
  return (typeof val !== "undefined") ? val : defaultVal;
}

function _noop() {
}

module.exports = {
  defaultVal: _defaultVal,
  noop: _noop
};
