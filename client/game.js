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
                if (!snake.headless) {
                    var head = snake.position[snake.position.length - 1];
                    var qtr = renderer.gridSize/4, half = renderer.gridSize/2;
                    renderer.drawBox(qtr,qtr,-half,-half,head,snake.publicSnake.headColour);
                }
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
                console.log(message);
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
            },
            // Returns the index into allSnakes of the snake at the grid position given, -1 if there is none
            snakeAtPosition: function(pos, multiple) {
                if (!pos || pos.length !== 2) {
                    return -1;
                }
                var x = Number(pos[0]), y = Number(pos[1]);
                if (isNaN(x)||isNaN(y)||x<0||y<0||x>=renderer.gridWidth||y>=renderer.gridHeight) {
                    return -1;
                }
                var s, p, all = [];
                for (s=0; s<allSnakes.length; s++) {
                    for (p=0; p<allSnakes[s].position.length; p++) {
                        var pos = allSnakes[s].position[p];
                        if (pos[0]===x && pos[1]===y) {
                            if (multiple) all.push(s);
                            else return s;
                        }
                    };
                };
                if (multiple) return all;
                else return -1;
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
    var nextPosition = function(pos, dir) {
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
    var turnDirection = function(dir, turn) {
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
        // gameRenderer.canvas.parentElement.addEventListener('keydown', function (e) {
        //     var key = e.keyIdentifier;
        //     if (keys[key]) {
        //         e.preventDefault();
        //         if (_this.turn===0) {
        //             _this.turn = keys[key];
        //         }
        //     }
        // });

        _this.think = function (snakePositions, myIndex, myDirection) {
            var t = _this.turn;
            _this.turn = 0;
            return t;
        };

        return _this;
    };

    var SexyAndIKnowIt = function () {
        var _this = PublicSnake("Sexy And I Know It", "#4444FF", "#00FF00", {}, "");

        _this.think = function (snakePositions, myIndex, myDirection) {
            //calculate distance to wall
            //check for collisions with self
            //check for collisions with other snakes
            //decide if should turn to decrease distance to wall
            var probablyGoodMove = Math.random() > 0.90 ? 1 : 0;
            var nextCoordinateIsDeath= false;
            myDirection = myDirection + probablyGoodMove;
            myDirection = myDirection % 4;
            var lastCoordinate = snakePositions[myIndex][snakePositions[myIndex].length - 1];
            var newCoordinate = nextPosition(lastCoordinate, myDirection);
            snakePositions.forEach(function (snake) {
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
        var gridWidth = gameRenderer.gridWidth; // These are promised in the API form
        var gridHeight = gameRenderer.gridHeight;

        _this.name = name;
        _this.colour = colour;
        _this.headColour = headColour;
        _this.data = data || {};
        var nextPosition = nextPosition;
        var turnDirection = turnDirection;
        var snakeAtPosition = gameRenderer.snakeAtPosition;
        // try {
            _this.think = (function() {
                // TODO: Potentially attempt to sandbox here
                var f;
                eval("f = function (snakePositions, myIndex, myDirection) { "+thinkFunction+" }");
                return f;
            })();
        console.log("public", _this, "think", _this.think);
        // } catch (e) {
        //     killSnake(_this, e);
        //     return false;
        // }
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
        console.log(reason, snake);
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
            // Find movements of all alive snakes
            if (snake.alive) calculateMove(snake, afterMove);
        });
    };



    var calculateMove = function(snake, afterMove) {
        var snakePositions = [], i, yourIndex;
        for (i=0; i<allSnakes.length; i++) {
            var other = allSnakes[i];
            snakePositions.push(other.position.slice());
            if (other==snake) {
                yourIndex = i;
            }
        }
        if (snake.turn === null) {
            setTimeout(function() {
                var direction;
                // try {
                    (function() {
                        direction = snake.publicSnake.think(snakePositions, yourIndex, snake.direction);
                    })();
                // } catch (e) {
                //     killSnake(snake, e);
                // }
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
                var newCoordinate = nextPosition(lastCoordinate, snake.direction);
                snake.position.push(newCoordinate);
                snake.turn = null;
            }
            gameRenderer.drawSnake(snake);
        });
    };

    var checkForCollisions = function() {
        var dehead = [];
        allSnakes.forEach(function(headSnake, s) {
            if (headSnake.alive) {
                var head = headSnake.position[headSnake.position.length - 1];

                var others = gameRenderer.snakeAtPosition(head, true);
                if (others.length > 1) {
                    var hadItself = false;
                    others.forEach(function(s) {
                        if (allSnakes[s]!==headSnake) {
                            // Collided with allSnakes[s]
                            var late = allSnakes[s].alive ? "" : "the late ";
                            var stupidly = allSnakes[s].alive ? "" : " stupidly";
                            killSnake(headSnake, headSnake.name+stupidly+" ran into "+late+allSnakes[s].name+"!");
                            dehead.push(headSnake);
                        } else {
                            if (hadItself) {
                                // Collided with self
                                killSnake(headSnake, headSnake.name+" killed itself!");
                            }
                            hadItself = true;
                        }
                    });
                }
            }
        });
        // Remove the head if it's in the same position as an alive snake
        dehead.forEach(function(snake) {
            snake.position.pop();
            snake.headless = true;
        });
    };

    var allSnakes;

    var start = function(snakeConstructors) {
        restart = function() {
            var re = allSnakes && allSnakes.ticking;
            allSnakes = [
                PrivateSnake(MattsPantsMonster()),
                PrivateSnake(SexyAndIKnowIt())
            ];
            allSnakes.ticking = true;
            if (snakeConstructors) {
                snakeConstructors.forEach(function(d) {
                    var snake = PublicSnake.apply(this, d);//(d[0], d[1], d[2], d[3], d[4]);
                    if (snake) snake = PrivateSnake(snake);
                    if (snake) allSnakes.push(snake);
                });
            }
            if (!re) tick();
        }
        restart();
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
            var cons = [name, colour, "#000000", {}, ai];
            e.preventDefault();
            start([cons]);
        });

        var selectedBtn = document.getElementById('battle_selected');
        selectedBtn.addEventListener('click', function (e) {
            var snakeCons = [];
            var boxs = $('[type="checkbox"]'), i;
            for (i=0;i<boxs.length;i++) {
                var box = boxs[i];
                if (box.checked) {
                    var tr = $(box).parent().parent()[0];
                    var id = tr.id.split("_")[1];
                    var name = $($('#snaikeName_'+id)[0]).text();
                    var colour = $($('#snaikeColour_'+id)[0]).text();
                    if (colour == "") colour = "#EEEEEE";
                    var ai = $($('#snaikeAI_'+id)[0]).text();
                    snakeCons.push([name, colour, "#000000", {}, ai]);
                    // function() {
                    //     var snake = PublicSnake(name, colour, "#000000", {}, ai);
                    //     if (snake) snake = PrivateSnake(snake);
                    //     return snake;
                    // };
                    // snakeCons.push(cons);
                }
            }
            start(snakeCons);
        });

    })();

    start();
};