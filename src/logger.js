/* global console module */

module.exports = function() {

    var _levelList = ["NONE",
                      "ERROR",
                      "WARNING",
                      "INFO",
                      "DEBUG"];

    var longest = 0;
    _levelList.forEach(function(name) {
        if (name.length > longest) {
            longest = name.length;
        }
    });

    var _levelMap = {};
    var _levelDetails = {};
    for (var i = 0; i < _levelList.length; i++) {
        _levelMap[_levelList[i]] = _levelList[i];
        _levelDetails[_levelList[i]] = {
            priority: i,
            prefix: _padRight(_levelList[i], longest+1)
        };
    }

    var _currentLevel = _levelMap.INFO;

    // Scripting interface
    ////////////////////////////////////////////////////////////////////////////

    var _scripting = function() {
        return {
            error: function(message, data) {
                _scriptLog(_levelMap.ERROR, message, data);
            },
            warning: function(message, data) {
                _scriptLog(_levelMap.WARNING, message, data);
            },
            info: function(message, data) {
                _scriptLog(_levelMap.INFO, message, data);
            },
            debug: function(message, data) {
                _scriptLog(_levelMap.DEBUG, message, data);
            }
        };
    }();

    // Public interface
    ////////////////////////////////////////////////////////////////////////////

    return function() {
        return {
            levels: _levelMap,
            setLevel: function(levelName) {
                if (typeof _levelDetails[levelName] !== "undefined") {
                    _currentLevel = levelName;
                }
            },
            error: function(moduleName, funcName, message, data) {
                _log(_levelMap.ERROR, moduleName, funcName, message, data);
            },
            warning: function(moduleName, funcName, message, data) {
                _log(_levelMap.WARNING, moduleName, funcName, message, data);
            },
            info: function(moduleName, funcName, message, data) {
                _log(_levelMap.INFO, moduleName, funcName, message, data);
            },
            debug: function(moduleName, funcName, message, data) {
                _log(_levelMap.DEBUG, moduleName, funcName, message, data);
            },
            getScripting: function() {
                return _scripting;
            }
        };
    }();

    // Private functions
    ////////////////////////////////////////////////////////////////////////////

    function _padRight(theString, length, char) {
        return theString+Array(length-theString.length+1).join(char||" ");
    }

    function _isLevelEnabled(levelName) {
        var enabled = false;
        if (typeof _levelDetails[levelName] !== "undefined") {
            if (_levelDetails[levelName].priority <=
                    _levelDetails[_currentLevel].priority) {
                enabled = true;
            }
        }
        return enabled;
    }

    function _scriptLog(levelName, message, data) {
      _log(levelName, "Scripting", "", message, data);
    }

    function _log(levelName, moduleName, funcName, message, data) {
        if (_isLevelEnabled(levelName)) {
            /* eslint-disable no-console */
            var output = _levelDetails[levelName].prefix;
            output += moduleName;
            if (funcName !== "") {
              output += "::" + funcName;
            }
            output += " " + message;
            console.log(output);
            if (typeof data !== "undefined") {
                console.log(data);
            }
            /* eslint-enable no-console */
        }
    }
}();
