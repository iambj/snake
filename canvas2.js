/*

    Canvas Snake by Brandon Johnson
    v1 - 1/7/2020

    TODO:

        - Add scoring
        - Add collisions on walls and snake
        - Throttle the input to skipFrames? (ie. use throttle.js to disallow spamming causing the snake to double back.)
        - Fix apple positions and create them as instances.
        - Game over and reset

*/

const skipFrames = 3;
var tick = 0;
var c = {
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    gridSize: 45,
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

var apple = {
    x: 10,
    y: 5
};

// Linked lists or use unshift and pop

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
        c.ctx.strokeStyle = "rgba(0,0,0,0.2)";
        drawLine(c.ctx, 0, i, c.width, i);
    }
    // Vertical
    for (var i = 0.5; i <= c.width; i += c.gridSize) {
        c.ctx.lineWidth = 0.5;
        c.ctx.strokeStyle = "rgba(0,0,0,0.2)";
        drawLine(c.ctx, i, 0, i, c.height);
    }
}

function changeDir(key) {
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
    // Create a grid
    setUpGrid();

    // Add random "apples"

    // Add on to tail

    // Follow tail

    // Collision detection
    c.canvas.addEventListener("keydown", e => {
        changeDir(e.key);
    });

    animate();
};

function moveSnake() {
    let curPos = [c.body[0].x, c.body[0].y];
    let newPart = {
        x: c.body[0].x,
        y: c.body[0].y
    };
    if (c.direction === "right") {
        newPart = {
            x: curPos[0] + 1,
            y: curPos[1]
        };
    }
    if (c.direction === "left") {
        newPart = {
            x: curPos[0] - 1,
            y: curPos[1]
        };
    }
    if (c.direction === "up") {
        newPart = {
            x: curPos[0],
            y: curPos[1] - 1
        };
    }
    if (c.direction === "down") {
        newPart = {
            x: curPos[0],
            y: curPos[1] + 1
        };
    }
    // console.log(newPart);
    if (c.body[0].x === apple.x && c.body[0].y === apple.y) {
        apple.x = Math.floor((Math.random() * c.width) / c.gridSize) - 5;
        apple.y = Math.floor((Math.random() * c.height) / c.gridSize) - 5;
        c.body.push(newPart);
    } else {
        c.body.unshift(newPart);
        c.body.pop();
    }

    // if (c.body.length > 1) {
    // }

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

function animate() {
    // ctx = c.ctx;
    if (tick < skipFrames) {
        tick++;
        requestAnimationFrame(animate);
        return;
    }
    tick = 0;
    requestAnimationFrame(animate);

    c.ctx.clearRect(0, 0, innerWidth, innerHeight);
    setUpGrid();
    spawnApple();

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
}

function spawnApple() {
    c.ctx.fillStyle = "red";
    // console.log("apples");

    c.ctx.fillRect(
        apple.x * c.gridSize,
        apple.y * c.gridSize,
        c.gridSize,
        c.gridSize
    );
}

function detectCollisions() {}

function randomApple() {
    apple.x = Math.floor((Math.random() * c.width) / c.gridSize) - 5;
    apple.y = Math.floor((Math.random() * c.height) / c.gridSize) - 5;
}

window.addEventListener("keydown", e => {
    if (e.key == " ") {
        randomApple();
    }
});
