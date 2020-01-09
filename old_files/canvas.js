var c = {
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    gridSize: 10,
    velocity: 5,
    body: []
};

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

function moveSnake(e) {
    key = e.key;

    if (key == "ArrowRight") {
        dx = c.velocity;
        dy = 0;
    } else if (key == "ArrowLeft") {
        dx = -c.velocity;
        dy = 0;
    } else if (key == "ArrowUp") {
        dx = 0;
        dy = -c.velocity;
    } else if (key == "ArrowDown") {
        dx = 0;
        dy = c.velocity;
    } else {
        return;
    }
}

window.onload = function() {
    c.canvas = document.getElementById("snakeCanvas");
    c.width = c.canvas.width = window.innerWidth - 2;
    c.height = c.canvas.height = window.innerHeight - 2;
    console.log(c);
    c.ctx = c.canvas.getContext("2d");
    console.log(c.width, c.gridSize);
    // Create a grid
    setUpGrid();
    // Add a player controlled mob

    // Add random "apples"

    // Add on to tail

    // Follow tail

    // Collision detection

    // Setup Handlers
    console.log(c.canvas);

    c.canvas.addEventListener("keydown", e => {
        moveSnake(e);
    });

    animate();
};

var dx = c.velocity;
var dy = 0;
var x = 0;
var y = 0;

function animate() {
    ctx = c.ctx;
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    setUpGrid();
    c.ctx.fillRect(x, y, c.gridSize, c.gridSize);
    x += dx;
    y += dy;
}
