'use strict';
/*globals self, postMessage*/

var userFunction;

self.evaluateFunction = function (code) {
  var fn;
  eval('fn = function (snakePositions, myIndex, myDirection) { ' + code + ' }');
  if (typeof fn === 'function') {
    userFunction = fn;
    postMessage(true);
  } else {
    postMessage(false);
  }
}

self.runFunction = function (argsArray) {
  if (typeof userFunction !== 'function') {
    postMessage(0);
  } else {
    var result = 0;
    try {
      result = userFunction.apply(this, argsArray);
    } catch (ex) {}
    postMessage(result);
  }
}

self.onmessage = function (event) {
  var data = event.data;
  if (typeof data.command === 'string' && typeof self[data.command] === 'function') {
    self[data.command](data.arguments);
  }
}
