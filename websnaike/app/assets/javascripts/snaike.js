// Project: SnAIke Game
// Author: Matt Lang, Lewis Christie
// Date: 2013
// 
'use strict';
var initSnaikeGame = function() {


    //context.clearRect(0,0,canvas.width,canvas.height);

    var gameRenderer = function() {
        var canvas = document.getElementById('game_canvas');
        var renderer = {
            canvas: canvas,
            context: canvas.getContext('2d'),
            gridSize: 16,
            gridWidth: 50,
            gridHeight: 25,
            shadowColour: "rgba(0, 0, 40, 0.75)",
            backgroundColour: '#FFFFFF',
            clearCanvas: function() {
                renderer.context.fillStyle = renderer.backgroundColour;
                renderer.context.fillRect(0,0,canvas.width,canvas.height);
            },
            drawSnake: function(snake) {
                snake.position.forEach(function(coordinate) {
                    renderer.drawBox(4,4,-2,-2,coordinate,renderer.shadowColour);
                    renderer.drawBox(1,1,-2,-2,coordinate,snake.publicSnake.colour);
                });
                var head = snake.position[snake.position.length - 1];
                var qtr = renderer.gridSize/4, half = renderer.gridSize/2;
                renderer.drawBox(qtr,qtr,-half,-half,head,snake.publicSnake.headColour);
            },
            drawBox: function(dx,dy,dw,dh,coord,colour) {
                renderer.context.fillStyle = colour;
                renderer.context.fillRect(
                    coord[0] * renderer.gridSize + dx,
                    coord[1] * renderer.gridSize + dy,
                    renderer.gridSize + dw,
                    renderer.gridSize + dh
                );
            },
            insultPlayer: function(message) {
                renderer.context.fillStyle = 'rgba(200, 200, 200, 0.8)';
                renderer.context.fillRect(0,90,renderer.canvas.width,40);
                renderer.context.fillStyle = '#000000';
                renderer.context.font = "20px sans-serif";
                renderer.context.fillText(message, 120, 120);
            },
            gameOver: function(winner) {
                if (!winner) {
                    renderer.insultPlayer("Game over!");
                } else {
                    renderer.insultPlayer("The cunning of "+winner.name+" out-witted all!");
                }
            }
        };
        canvas.width = (renderer.gridWidth+1)*renderer.gridSize;
        canvas.height = (renderer.gridHeight+1)*renderer.gridSize;
        renderer.clearCanvas();
        return renderer;
    }();
    
    // var snake = {
    //     direction: 0,
    //     hadInput: false,
    //     position: [[7,10]],
    //     move: function () {
    //         snakeColour = '#' + Math.floor((Math.random() * 256*256*256)).toString(16);
    //         if (snake.position.length > 10) {
    //             snake.position.shift();
    //         }
    //         var lastCoordinate = snake.position[snake.position.length - 1];
    //         var newCoordinate;
    //         if (snake.direction === 0) {
    //             newCoordinate = [lastCoordinate[0], lastCoordinate[1] -1];
    //         } else if (snake.direction === 1) {
    //             newCoordinate = [lastCoordinate[0] + 1, lastCoordinate[1]];
    //         } else if (snake.direction === 2) {
    //             newCoordinate = [lastCoordinate[0], lastCoordinate[1] + 1];
    //         } else if (snake.direction === 3) {
    //             newCoordinate = [lastCoordinate[0] - 1, lastCoordinate[1]];
    //         }
    //         if (newCoordinate[0] > gameRenderer.gridWidth) {
    //             newCoordinate[0] = 0;
    //         }
    //         if (newCoordinate[0] < 0) {
    //             newCoordinate[0] = gameRenderer.gridWidth;
    //         }
    //         if (newCoordinate[1] > gameRenderer.gridHeight) {
    //             newCoordinate[1] = 0;
    //         }
    //         if (newCoordinate[1] < 0) {
    //             newCoordinate[1] = gameRenderer.gridHeight;
    //         }
    //         snake.position.push(newCoordinate);
            
    //         gameRenderer.drawSnake(snake);
    //     }
    // };
    var calculatePosition = function(pos, dir) {
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
        if (newPos[0] > gameRenderer.gridWidth) {
            newPos[0] = 0;
        }
        if (newPos[0] < 0) {
            newPos[0] = gameRenderer.gridWidth;
        }
        if (newPos[1] > gameRenderer.gridHeight) {
            newPos[1] = 0;
        }
        if (newPos[1] < 0) {
            newPos[1] = gameRenderer.gridHeight;
        }
        return newPos;
    };
    var calculateDirection = function(dir, turn) {
        if (turn < 0) {
            dir = dir - 1;
        } else if (turn > 0) {
            dir = dir + 1;
        }
        if (dir > 3) {
            dir = 0;
        }
        if (dir < 0) {
            dir = 3;
        }
        return dir;
    }

    var MattsPantsMonster = function () {
        var _this = PublicSnake("Matt's Pants Monster", "#F4F400", "#999999", {}, "");

        var keys = {
            "Left": -1,
            "Right": 1
        };
        _this.turn = 0;
        window.addEventListener('keydown', function (e) {
            var key = e.keyIdentifier;
            if (keys[key]) {
                e.preventDefault();
                if (_this.turn===0) {
                    _this.turn = keys[key];
                }
            }
        });

        _this.think = function (myPosition, otherSnakes, gridWidth, gridHeight) {
            var t = _this.turn;
            _this.turn = 0;
            return t;
        };

        return _this;
    };

    var SexyAndIKnowIt = function () {
        var _this = PublicSnake("Sexy And I Know It", "#4444FF", "#00FF00", {}, "");

        _this.think = function (myPosition, myDirection, otherSnakes) {
            //calculate distance to wall
            //check for collisions with self
            //check for collisions with other snakes
            //decide if should turn to decrease distance to wall
            var probablyGoodMove = Math.random() > 0.90 ? 1 : 0;
            otherSnakes.push(myPosition);
            var nextCoordinateIsDeath= false;
            myDirection = myDirection + probablyGoodMove;
            myDirection = myDirection % 4;
            var lastCoordinate = myPosition[myPosition.length - 1];
            var newCoordinate = _this.calculatePosition(lastCoordinate, myDirection);
            otherSnakes.forEach(function (snake) {
                snake.forEach(function (coordinate) {
                    if (newCoordinate[0] === coordinate[0] &&
                        newCoordinate[1] === coordinate[1]) {
                        nextCoordinateIsDeath = true;
                    }
                });
            })
            if (nextCoordinateIsDeath === true) {
                return -1;
            }
            return probablyGoodMove;
        };

        return _this;
    };

    var PublicSnake = function (name, colour, headColour, data, thinkFunction) {
        var _this = {};

        _this.name = name;
        _this.colour = colour;
        _this.headColour = headColour;
        _this.data = data || {};
        _this.data.gridWidth = gameRenderer.gridWidth;
        _this.data.gridHeight = gameRenderer.gridHeight;
        _this.calculatePosition = calculatePosition;
        _this.calculateDirection = calculateDirection;
        try {
            _this.think = (function() {
                // TODO: Potentially attempt to sandbox here
                var f;
                eval("f = function (myPosition, myDirection, otherSnakes) { "+thinkFunction+" }");
                return f;
            })();
        } catch (e) {
            killSnake(_this, e);
            return false;
        }
        return _this;
    };

    var PrivateSnake = function (publicSnake) {
        var _this = {};

        // Not changable within user defined function
        _this.name = publicSnake.name;
        _this.publicSnake = publicSnake;

        var pos = getStartPosition();

        // Whether this snake is still being AI controlled
        _this.alive = true;
        // The direction (<0:left, >0:right) to turn for this tick
        _this.turn = null;
        // 0: North, 1:East, etc
        _this.direction = pos.direction;
        // Grid index from [0,0] to [gameRenderer.gridWidth, ..gridHeight]
        _this.position = pos.position;
        // Increments each time the game ticks faster than the asynchronous user defined AI runs
        _this.missedTurnCount = 0;

        return _this;
    };

    // Get a non-occupied position, and a direction that doesn't have anyone else in front of
    // TODO
    var getStartPosition = function() {
        return {
            position: [[Math.floor(Math.random()*gameRenderer.gridWidth),Math.floor(Math.random()*gameRenderer.gridWidth)]],
            direction: 0
        };
    };

    // var keys = {
    //     "Left": 1,
    //     "Right": 1
    // };
    // window.addEventListener('keydown', function (e) {
    //     var key = e.keyIdentifier;
    //     if (keys[key]) {
    //         e.preventDefault();
    //         if (!snake.hadInput) {
    //             snake.hadInput = true;
    //             if (key === "Left") {
    //                 snake.direction = snake.direction - 1;
    //             } else if (key === "Right") {
    //                 snake.direction = snake.direction + 1;
    //             }
    //             if (snake.direction > 3) {
    //                 snake.direction = 0;
    //             }
    //             if (snake.direction < 0) {
    //                 snake.direction = 3;
    //             }
    //         }
            
    //         return false;
    //     }
    // });

    // var tick = function() {
    //     snake.hadInput = false;
    //     snake.move();
    //     var head = snake.position[snake.position.length - 1];
    //     var i;
    //     for(i = 0; i < snake.position.length - 1; i++) {
    //         if (head[0] === snake.position[i][0] &&
    //             head[1] === snake.position[i][1]) {
    //             clearInterval(loop);
    //             gameRenderer.insultPlayer("You Lose!");
    //         }
    //     }
    // };
    // var loop = setInterval(tick, 250);


    var killSnake = function(snake, reason) {
        snake.alive = false;
        snake.turn = null;
        console.log(snake, reason);
    };

    var tick = function() {
        if (!allSnakes.ticking) return;
        var movingCount = 0,
            toMoveCount = 0,
            lastAlive,
            time = (new Date()).getTime();
        checkForCollisions();
        allSnakes.forEach(function(snake) {
            if (snake.alive) {
                lastAlive = snake;
                toMoveCount += 1;
            }
        });
        if (toMoveCount<2) {
            gameRenderer.gameOver(lastAlive);
            allSnakes.ticking = false;
            return;
        }
        var afterMove = function() {
            movingCount += 1;
            if (movingCount===toMoveCount) {
                renderGame();
                var timeUntilAgain = 250 - ((new Date()).getTime()-time);
                if (timeUntilAgain < 0) {
                    timeUntilAgain = 0;
                }
                setTimeout(tick, timeUntilAgain);
            }
        };
        // Get all the snake positions to pass to think functions
        allSnakes.forEach(function(snake) {
            if (snake.alive) calculateMove(snake, afterMove);
        });
    };



    var calculateMove = function(snake, afterMove) {
        var otherSnakes = [];
        allSnakes.forEach(function(other) {
            if (other!==snake) {
                otherSnakes.push(other.position.slice());
            }
        });
        if (snake.turn === null) {
            setTimeout(function() {
                var direction;
                try {
                    (function() {
                        direction = snake.publicSnake.think(snake.position.slice(), snake.direction, otherSnakes);
                    })();
                } catch (e) {
                    killSnake(snake, e);
                }
                snake.turn = Number(direction);
                if (isNaN(snake.turn)) {
                    snake.turn = 0;
                }
                afterMove();
            }, 1);
        } else {
            snake.missedTurnCount += 1;
        }
    };

    var renderGame = function() {
        gameRenderer.clearCanvas()
        allSnakes.forEach(function(snake) {
            if (snake.turn !== null) {
                if (snake.position.length > 20) {
                    snake.position.shift();
                }
                if (snake.turn < 0) {
                    snake.direction = snake.direction - 1;
                } else if (snake.turn > 0) {
                    snake.direction = snake.direction + 1;
                }
                if (snake.direction > 3) {
                    snake.direction = 0;
                }
                if (snake.direction < 0) {
                    snake.direction = 3;
                }
                var lastCoordinate = snake.position[snake.position.length - 1];
                var newCoordinate = calculatePosition(lastCoordinate, snake.direction);
                snake.position.push(newCoordinate);
                snake.turn = null;
            }
            gameRenderer.drawSnake(snake);
        });
    };

    var checkForCollisions = function() {
        allSnakes.forEach(function(headSnake) {
            var head = headSnake.position[headSnake.position.length - 1];
            allSnakes.forEach(function(snake) {
                var i;
                for (i = 0; i <= snake.position.length - 1; i++) {
                    if (head!==snake.position[i] && 
                        head[0] === snake.position[i][0] &&
                        head[1] === snake.position[i][1]) {
                        killSnake(headSnake, "Collided with "+snake.name);
                    }
                }
            });
        });
    };

    var allSnakes;

    var start = function(usersSnake) {
        var re = allSnakes && allSnakes.ticking;
        allSnakes = [
            PrivateSnake(MattsPantsMonster()),
            PrivateSnake(SexyAndIKnowIt())
        ];
        if (usersSnake) allSnakes.push(usersSnake()); 
        if (!re) tick();
    };

    var restart = start;

    (function() {
        var resetBtn = document.getElementById('reset');
        resetBtn.addEventListener('click', function (e) {
            restart();
        });

        var testAiBtn = document.getElementById('test_ai');
        testAiBtn.addEventListener('click', function (e) {
            var name = document.getElementById('snaike_name').value;
            var colour = document.getElementById('snaike_colour').value;
            var ai = document.getElementById('snaike_ai').value;
            if (name==="") return false;
            restart = function() {
                var snake = PublicSnake(name, colour, "#000000", {}, ai);
                if (snake) snake = PrivateSnake(PublicSnake);
                start(snake);
            }
        });
    })();

    start();
};