/*

    Canvas Snake v2 by Brandon Johnson
    created 1/7/2020

    TODO:

        [x] - Add scoring
        [x] - Add collisions on walls and snake
        [x] - Difficulties
        [x] - Fix apple positions and create them as instances.
        [x] - Multiple apple support
        [ ] - Refactor the snake and canvas object to their own classes
        [ ] - Abstract out as classes
        [x] - Standardize the size of the canvas (edges aren't a full gridSize)
        [x] - Apples spawn off canvas because of above
        [ ] - Random snake start
        [ ] - End a crash before going off stage (check ahead a grid space, if snake is only 1 cell, it looks like it goes off the screen)
        [ ] - Game over and reset
        [ ] - Themes
        [ ] - Munch sound 🙂 https://freesound.org/people/PapercutterJohn/sounds/318608/
        [ ] - Adjust canvas size on resize
    
    BUG:
        [ ] - Some weirdness when turning. Snake head turns after already moving an additional block forward.

*/

var tick = 0;
var score = 0;
var best = 0;
var gridOn = true;
var pause = false;
var moving = false;
var keyDown = false;

// FPS data
var curSecond = 0,
    frameCount = 0,
    framesLastSecond = 0;

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

// TODO: Refactor as a class
// This is the snake and the canvas. No no!
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
    ]
};

var apples = [];

class Apples {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    // Removes the munched apple from the apples array.
    static munchApples(snake) {
        for (var i = 0; i < apples.length; i++) {
            if (snake.x === apples[i].x && snake.y === apples[i].y) {
                console.log("munch");
                for (var i = 0; i < apples.length; i++) {
                    if (snake.x === apples[i].x && snake.y === apples[i].y) {
                        apples.splice(i, 1);
                        this.spawnApples();
                    }
                }
                return true;
            }
        }
    }
    // Loops through the apples array and renders them to the canvas.
    static renderApples() {
        for (var i = 0; i < apples.length; i++) {
            c.ctx.fillStyle = "red";
            c.ctx.strokeStyle = "black";
            c.ctx.beginPath();
            c.ctx.arc(
                apples[i].x * c.gridSize + c.gridSize / 2,
                apples[i].y * c.gridSize + c.gridSize / 2,
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
                apples[i].x * c.gridSize + c.gridSize / 2 - rectSize / 2,
                apples[i].y * c.gridSize + rectSize,
                rectSize,
                rectSize * 1.5
            );
        }
    }
    // Creates a new apple into the apples array
    static spawnApples() {
        let x = Math.floor((Math.random() * c.width) / c.gridSize);
        let y = Math.floor((Math.random() * c.height) / c.gridSize);
        let apple = new Apples(x, y);
        apples.push(apple);
    }
}

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
    // Make sure the canvas is sized in full grid sizes.
    let maxWidth = Math.floor(window.innerWidth / 1.25);
    let cellsW = Math.floor(maxWidth / this.c.gridSize);
    let maxHeight = Math.floor(window.innerHeight / 1.25);
    let cellsH = Math.floor(maxHeight / this.c.gridSize);
    c.width = c.canvas.width = cellsW * this.c.gridSize;
    c.height = c.canvas.height = cellsH * this.c.gridSize;

    c.ctx = c.canvas.getContext("2d");

    c.canvas.addEventListener("keydown", e => {
        if (e.key == " ") {
            Apples.spawnApples();
        }
    });
    c.canvas.addEventListener("keydown", e => {
        changeDir(e.key);
    });
    c.canvas.addEventListener("keyup", e => {
        keyDown = false;
    });
    var apple = new Apples(7, 14);
    apples.push(apple);
    animate();
};

function moveSnake() {
    moving = true;

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

    if (Apples.munchApples(c.body[0]) === true) {
        score++;
        c.body.push(newPart);
        // apple = null;
        c.ctx.fillStyle = "black";
        for (let i = 0; i < c.body.length; i++) {
            c.ctx.fillRect(
                c.body[i].x * c.gridSize,
                c.body[i].y * c.gridSize,
                c.gridSize,
                c.gridSize
            );
        }
    } else {
        c.body.unshift(newPart);
        c.body.pop();
        detectCollisions(newPart);
        c.ctx.fillStyle = "black";
        for (let i = 0; i < c.body.length; i++) {
            c.ctx.fillRect(
                c.body[i].x * c.gridSize,
                c.body[i].y * c.gridSize,
                c.gridSize,
                c.gridSize
            );
        }
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

    Apples.renderApples();

    moveSnake();
    updateScore(score);
    // fpsCounter();
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

function updateScore(score = 0) {
    c.ctx.font = "24px Courier";
    c.ctx.fillStyle = "blue";
    c.ctx.fillText(`Score: ${score}`, 5, 20);
}

function restart() {
    console.log("Restarting game.");
    window.location.reload();
    // TODO: (maybe) Reload aspects of the game instead of entire page. This is causing the second game to go at 2x speed.
    // c.direction = "";
    // c.body[0].x = 5;
    // c.body[0].y = 5;
    // cancelAnimationFrame(frames);
    // animate();
}

// Doesn't really work since we are skipping frames to adjust the speed of the snake. But good for regular animations.
function fpsCounter() {
    var sec = Math.floor(Date.now() / 1000);
    if (sec != curSecond) {
        curSecond = sec;
        framesLastSecond = frameCount;
        frameCount = 1;
    } else {
        frameCount++;
    }
    c.ctx.font = "24px Courier";
    c.ctx.fillStyle = "blue";
    let dynamicX = framesLastSecond >= 10 ? 30 : 20;
    c.ctx.fillText(`${framesLastSecond}`, c.width - dynamicX, 20);
}
