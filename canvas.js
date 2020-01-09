/*

    Canvas Snake v2 by Brandon Johnson
    created 1/7/2020

    TODO:

        [x] -  Add scoring
        [x] - Add collisions on walls and snake
        [x] - Difficulties
        [ ] - Fix apple positions and create them as instances.
        [ ] - Game over and reset
        [ ] - Random snake start
        [ ] - Standardize the size of the canvas (edges aren't a full gridSize)
        [ ] - Abstract out as classes
        [ ] - Multiple apple support
        [ ] - Themes
        [ ] - Munch sound 🙂 https://freesound.org/people/PapercutterJohn/sounds/318608/
    
    BUG:
        [ ] - Some weirdness when turning. Snake head turns after already moving an additional block forward.
        [ ] - Throttle (didn't work) the input to skipFrames? (ie. use throttle.js to disallow spamming causing the snake to double back.)

*/

var tick = 0;
var score = 0;
var best = 0;
var gridOn = false;
var pause = false;
var moving = false;
var keyDown = false;

const difficulties = {
    easy: {
        skipFrames: 3,
        gridSize: 45
    },
    medium: {
        skipFrames: 2,
        gridSize: 25
    },
    hard: {
        skipFrames: 0,
        gridSize: 10
    }
};
var difficulty = "easy";
var skipFrames = difficulties[difficulty].skipFrames;

var c = {
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    gridSize: difficulties[difficulty].gridSize,
    velocity: 5,
    direction: null,
    // Cords below are by the grid
    body: [
        {
            x: 6,
            y: 5
        }
        // { x: 4, y: 5 }
    ]
};

class Apples {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    munchApples(snake) {
        // Randomly move the apple eaten.
        if (snake.x === this.x && snake.y === this.y) {
            this.x = Math.floor((Math.random() * c.width) / c.gridSize) - 5;
            this.y = Math.floor((Math.random() * c.height) / c.gridSize) - 5;
            return true;
        }
    }
    spawnApple() {
        c.ctx.fillStyle = "red";
        c.ctx.strokeStyle = "black";
        c.ctx.beginPath();
        c.ctx.arc(
            this.x * c.gridSize + c.gridSize / 2,
            this.y * c.gridSize + c.gridSize / 2,
            c.gridSize / 4,
            0,
            Math.PI * 2,
            false
        );
        c.ctx.fill();
        c.ctx.stroke();
        c.ctx.fillStyle = "black";
        let rectSize = c.gridSize / 10;
        c.ctx.fillRect(
            this.x * c.gridSize + c.gridSize / 2 - rectSize / 2,
            this.y * c.gridSize + rectSize,
            rectSize,
            rectSize * 1.5
        );
    }
}
var apple = new Apples(5, 5);

function drawLine(ctx, x, y, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function setUpGrid() {
    // Horizontal
    for (var i = 0.5; i <= c.height; i += c.gridSize) {
        c.ctx.lineWidth = 0.5;
        c.ctx.strokeStyle = "rgba(0,0,0,0.1)";
        drawLine(c.ctx, 0, i, c.width, i);
    }
    // Vertical
    for (var i = 0.5; i <= c.width; i += c.gridSize) {
        c.ctx.lineWidth = 0.5;
        c.ctx.strokeStyle = "rgba(0,0,0,0.1)";
        drawLine(c.ctx, i, 0, i, c.height);
    }
}

function changeDir(key) {
    if (moving == true || keyDown == true) {
        return;
    }
    keyDown = true;
    setTimeout(() => {
        keyDown = false;
    }, 25);
    if (key == "ArrowRight") {
        if (c.direction === "left") {
            return;
        }
        c.direction = "right";
        //addSnake();
    } else if (key == "ArrowLeft") {
        if (c.direction === "right") {
            return;
        }
        c.direction = "left";
        //addSnake();
        // dx = -c.velocity;
        // c.body[0].x -= 1;
    } else if (key == "ArrowUp") {
        if (c.direction === "down") {
            return;
        }
        c.direction = "up";
        //addSnake();
        // dx = 0;
        // dy = -c.velocity;
        // c.body[0].y -= 1;
    } else if (key == "ArrowDown") {
        if (c.direction === "up") {
            return;
        }
        c.direction = "down";
        //addSnake();
        // dx = 0;
        // dy = c.velocity;
        // c.body[0].y += 1;
    } else {
        return;
    }
}

window.onload = function() {
    c.canvas = document.getElementById("snakeCanvas");
    c.width = c.canvas.width = window.innerWidth - 2;
    c.height = c.canvas.height = window.innerHeight - 2;
    c.ctx = c.canvas.getContext("2d");

    c.canvas.addEventListener("keydown", e => {
        if (e.key == " ") {
            randomApple();
        }
    });
    c.canvas.addEventListener("keydown", e => {
        changeDir(e.key);
    });
    c.canvas.addEventListener("keyup", e => {
        keyDown = false;
    });

    animate();
};

function moveSnake() {
    moving = true;
    console.log(c.direction);

    let curPos = [c.body[0].x, c.body[0].y];
    let newPart = {
        x: c.body[0].x,
        y: c.body[0].y
    };
    if (c.direction === "right" && c.direction !== "left") {
        newPart = {
            x: curPos[0] + 1,
            y: curPos[1]
        };
    }
    if (c.direction === "left" && c.direction !== "right") {
        newPart = {
            x: curPos[0] - 1,
            y: curPos[1]
        };
    }
    if (c.direction === "up" && c.direction !== "down") {
        newPart = {
            x: curPos[0],
            y: curPos[1] - 1
        };
    }
    if (c.direction === "down" && c.direction !== "up") {
        newPart = {
            x: curPos[0],
            y: curPos[1] + 1
        };
    }

    if (apple.munchApples(c.body[0]) === true) {
        score++;
        c.body.push(newPart);
    } else {
        c.body.unshift(newPart);
        c.body.pop();
        detectCollisions(newPart);
    }

    c.ctx.fillStyle = "black";
    for (let i = 0; i < c.body.length; i++) {
        c.ctx.fillRect(
            c.body[i].x * c.gridSize,
            c.body[i].y * c.gridSize,
            c.gridSize,
            c.gridSize
        );
    }
    moving = false;
}

var frames; // Used to reference the animation
function animate() {
    if (pause === true) {
        c.direction = "";
        frames = requestAnimationFrame(animate);
        return;
    }
    if (tick < skipFrames) {
        tick++;
        tets = requestAnimationFrame(animate);
        return;
    }
    tick = 0;
    frames = requestAnimationFrame(animate);

    c.ctx.clearRect(0, 0, innerWidth, innerHeight);

    gridOn === true ? setUpGrid() : null;

    apple.spawnApple();

    // console.log(c.direction);
    // switch (c.direction) {
    //     case "right":
    //         c.body[0].x += 1;
    //         break;
    //     case "left":
    //         c.body[0].x -= 1;
    //         break;
    //     case "down":
    //         c.body[0].y += 1;
    //         break;
    //     case "up":
    //         c.body[0].y -= 1;
    //         break;
    // }

    moveSnake();
    updateScore(score);
}

function detectCollisions(snake) {
    if (
        snake.x < 0 ||
        snake.y < 0 ||
        snake.x > c.width / c.gridSize - 0 ||
        snake.y > c.height / c.gridSize - 0
    ) {
        console.log("crash!");

        cancelAnimationFrame(frames);
        return;
    }
    for (let i = 1; i < c.body.length; i++) {
        if (snake.x === c.body[i].x && snake.y === c.body[i].y) {
            cancelAnimationFrame(frames);
            console.log("crash!");
            return;
        }
    }
}

function randomApple() {
    apple.x = Math.floor((Math.random() * c.width) / c.gridSize) - 5;
    apple.y = Math.floor((Math.random() * c.height) / c.gridSize) - 5;
}

function updateScore(score = 0) {
    c.ctx.font = "24px Courier";
    c.ctx.fillStyle = "blue";
    c.ctx.fillText(`Score: ${score}`, 15, 30);
}

function restart() {
    console.log("Restarting game.");
    c.direction = "";
    c.body[0].x = 5;
    c.body[0].y = 5;
    cancelAnimationFrame(frames);
    animate();
}

// From throttle.js

var delayedTimer = null;
var throttled = [];
var throttle = function(time, scope, callback, args, delayed = null) {
    window.clearTimeout(delayedTimer);
    console.log(delayedTimer);
    if (throttled.length >= 1) {
        for (var i = 0; i <= throttle.length; i++) {
            if (throttled[i] === scope) {
                console.log("Throttling!");
                if (delayed == true) {
                    console.log("delayed");
                    delayedTimer = setTimeout(function() {
                        callback(args);
                        console.log("called!");
                    }, time);
                }
                return false;
            }
        }
    }

    throttled.push(scope);
    var timer = setTimeout(function() {
        throttled.splice(throttled.indexOf(scope, 1));
    }, time);
    if (typeof callback === "function") {
        callback(args);
        return true;
    }
    return null;
};
