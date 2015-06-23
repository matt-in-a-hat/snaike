'use strict';
/*globals self, postMessage*/

var userFunction;
var game = {};

game.calculateNextPosition = function(pos, dir) {
  var newPos;
  dir = dir%4;
  if (dir === 0) {
      newPos = [pos[0], pos[1] -1];
  } else if (dir === 1) {
      newPos = [pos[0] + 1, pos[1]];
  } else if (dir === 2) {
      newPos = [pos[0], pos[1] + 1];
  } else if (dir === 3) {
      newPos = [pos[0] - 1, pos[1]];
  }
  if (newPos[0] > game.gridWidth) {
      newPos[0] = 0;
  }
  if (newPos[0] < 0) {
      newPos[0] = game.gridWidth;
  }
  if (newPos[1] > game.gridHeight) {
      newPos[1] = 0;
  }
  if (newPos[1] < 0) {
      newPos[1] = game.gridHeight;
  }
  return newPos;
};

self.init = function (height, width) {
  game.gridHeight = height;
  game.gridWidth = width;
}

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
