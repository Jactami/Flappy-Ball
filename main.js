var canvas;
const HEIGHT = 500;
const WIDTH = 800;
var score = 0;
var highscore = 0;
var ball;
var pipes = [];
const GRAVITY = 0.4;
const GAP = HEIGHT * 0.3;
var gameLost = true;
var restartReady = true;

var debuggingMode = false;

// create background, ball and first pipe and also reset if game was lost
function setup() {
    if (canvas) {
        canvas.remove();
    }

    canvas = d3.select('body')
        .insert('svg', ':first-child')
        .attr("width", WIDTH)
        .attr("height", HEIGHT);

    canvas.append("rect")
        .attr("width", WIDTH)
        .attr("height", HEIGHT)
        .attr("fill", "lightblue");

    ball = new Ball(WIDTH / 8, HEIGHT / 2);
    ball.show();

    pipes = [];
    pipes.push(new Pipe());
    pipes[0].show();

    score = 0;
    document.getElementById("highscore").innerHTML = "Highscore: " + highscore;
    document.getElementById("score").innerHTML = "Current: " + score;
}

// handle game logic
function play() {
    // ball falling
    ball.update();
    // check if ball moves offscreen
    if (ball.offScreen()) {
        gameOver();
    }
    // pipes moving
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].update();
        // create new pipes
        if (pipes[i].x < WIDTH * 0.6 && !pipes[i].checked) {
            let pipe = new Pipe();
            pipe.show();
            pipes.push(pipe);
            pipes[i].checked = true;
        }
        // delete pipes
        if (pipes[i].offScreen()) {
            pipes[i].delete()
            pipes.shift(i, 1);
        }
        // increase score if ball passes a pipes
        if (ball.x > pipes[i].x + pipes[i].size && !pipes[i].passed) {
            score++;
            document.getElementById("score").innerHTML = "Current: " + score;
            pipes[i].passed = true;
        }
        // detect collision
        if (ball.x + ball.r > pipes[i].x && ball.x - ball.r < pipes[i].x + pipes[i].size) {
            if (ball.y - ball.r < pipes[i].upperHeight || ball.y + ball.r > pipes[i].lowerY) {
                pipes[i].highlight();
                gameOver();
            }
        }
    }

    if (!gameLost) requestAnimationFrame(play);
}

function gameOver() {
    if (debuggingMode) {
        if (ball.y + ball.r > HEIGHT) {
            ball.y = HEIGHT - ball.r;
            ball.vel = 0;
        }
    } else {
        gameLost = true;
        restartReady = false;
        if (score > highscore) {
            highscore = score;
        }
        // reset game
        setTimeout(function () {
            restartReady = true;
        }, 500);
    }
}

// listen for user actions
document.addEventListener("keydown", function (e) {
    if (e.key === " " && !e.repeat) {
        // restart game
        if (gameLost && restartReady) {
            gameLost = false;
            setup();
            play();
        }
        // jump
        ball.move();
    }
});