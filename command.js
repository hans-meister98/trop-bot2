var method = Command.prototype;

var _callName;
var _definition;

function Command(callName, definition) {
    this._callName = callName;
    this._definition = definition;
}

method.getCallName = function() {
    return this._callName.toString();
};

method.getDefinition = function() {
    return this._definition.toString();
};

module.exports = Command;