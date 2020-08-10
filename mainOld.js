//properties of the screen
var widthScr = 800;
var heightScr = 500;
var canvas;
var background;
//properties of the ball
var xB = 100;
var yB;
var r = 15;
var gravity = 0.4;
var velB = 0;
//properties of the pipes
var widthP = 40;
var heightP;
var gap = 150;
var velP = 5;
//ingame objects
var ball;
var pipes = [];
var score;

//initial call after page is loaded
function start() {
    createScreen();
    createPipe();
    createBall();
    play();
}

//setup canvas, background and score
function createScreen() {
    canvas = d3.select('body')
        .insert('svg', ':first-child')
        .attr("width", widthScr)
        .attr("height", heightScr);

    background = canvas.append("rect")
        .attr("width", widthScr)
        .attr("height", heightScr)
        .attr("fill", "lightblue");

    score = 0;
    document.getElementById("score").innerHTML = "Score: " + score;
}

//show ball in its initial position
function createBall() {
    yB = heightScr / 2;
    ball = canvas.append("circle")
        .attr("class", "ball")
        .attr("cx", xB)
        .attr("cy", yB)
        .attr("r", r)
        .attr("fill", "red")
        .attr("stroke-width", 2)
        .attr("stroke", "darkred");
}

//create a pipe in its initial position
function createPipe() {
    heightP = Math.floor(Math.random() * 250) + 50;

    let pipe = {
        x : widthScr,

        upperPipe : canvas.append("rect")
            .attr("class", "pipe")
            .attr("x", widthScr)
            .attr("y", 0)
            .attr("height", heightP)
            .attr("width", widthP)
            .attr("fill", "gray")
            .attr("stroke-width", 2)
            .attr("stroke", "black"),

        lowerPipe : canvas.append("rect")
            .attr("class", "pipe")
            .attr("x", widthScr)
            .attr("y", heightP + gap)
            .attr("height", heightScr - gap - heightP)
            .attr("width", widthP)
            .attr("fill", "gray")
            .attr("stroke-width", 2)
            .attr("stroke", "black")
    };
    pipes.push(pipe);
}

//handle game logic
function play(){
    //ball falling
    velB += gravity;
    yB += velB;
    ball.attr("cy", yB);
    //ball jumping
    document.addEventListener("keypress", function() {
        velB = -5;
    });
    //reload if ball leaves screen
    if (yB < r || yB > heightScr - r) location.reload();
    //ball "moving"/ pipes moving
    for (var i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x = pipes[i].x - velP;
        let xP = pipes[i].x;
        pipes[i].upperPipe.attr("x", xP);
        pipes[i].lowerPipe.attr("x", xP);
        //reload if ball hits pipes
        if (yB - r < pipes[i].upperPipe.attr("height") || yB + r > pipes[i].lowerPipe.attr("y")) {
            if (xB + r > xP && xB - r < xP + widthP) location.reload();
        }
        //delete pipes offscreen
        if (xP === -widthP -1) {
            pipes.shift(i, 1);
        }
        //create new pipes
        if (xP === widthScr - 300) {
            createPipe()
        }
        //increase score if ball passes pipe
        if (xP === 100) {
            score++;
            document.getElementById("score").innerHTML = "Score: " + score;
        }
    }
    requestAnimationFrame(play);
}
