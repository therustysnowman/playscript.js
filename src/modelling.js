module.exports = {
  extractDefaults: _extractDefaults
};

function _extractDefaults(model) {

    var ret = {};

    Object.keys(model).forEach(function(elementName) {
        var element = model[elementName];
        if (element.type === "container" && typeof element.content !== "undefined") {
            ret[elementName] = _extractDefaults(element.content);
        } else if (typeof element.default !== "undefined") {
            ret[elementName] = element.default;
        }
    });

    return ret;
}
