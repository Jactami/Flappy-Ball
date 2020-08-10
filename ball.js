class Ball {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.r = HEIGHT * 0.03;
        this.vel = 0;
        this.body;
    }

    // display ball on screen
    show() {
        this.body = canvas.append("circle")
            .attr("class", "ball")
            .attr("cx", this.x)
            .attr("cy", this.y)
            .attr("r", this.r)
            .attr("fill", "red")
            .attr("stroke-width", 2)
            .attr("stroke", "darkred");
    }

    // move ball according to its velocity
    update() {
        this.vel += GRAVITY;
        this.y += this.vel;
        this.body.attr("cy", this.y);
    }

    // decrease falling speed if user decides to jump
    move() {
        this.vel = -5;
        // jump only if ball is falling!
        // if (this.vel >= 0) this.vel = -7;
    }

    // return true if ball is off screen, false otherwise
    offScreen() {
        return (this.y + this.r > HEIGHT || this.y < this.r);
    }
}
