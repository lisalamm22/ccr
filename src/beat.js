const Util = require("./util");

const DEFAULTS = {
  TYPE: "PRESS",
  SHAPE: "DOT",
  SEQ: "",
//   ACTIVE: false,
  COLOR: "rgba(255, 255, 255, .75)",
  RADIUS: 50,
};

function Beat(options){
    this.pos = options.pos;
    this.time = options.time;
    this.type = options.type || DEFAULTS.TYPE;
    this.shape = options.shape || DEFAULTS.SHAPE;
    this.seq = options.seq || DEFAULTS.SEQ;
    // this.active = options.active || DEFAULTS.ACTIVE;
    this.color = options.color || Util.randomColor(0.75) || DEFAULTS.COLOR;
    this.radius = options.radius || DEFAULTS.RADIUS;
    this.opacity = 0;
}

Beat.prototype.draw = function draw(ctx, opacity, radiusMul=1, seq) {
    ctx.beginPath();
    ctx.globalAlpha = 0.25*opacity;
    ctx.arc(this.pos[0], this.pos[1], this.radius*radiusMul, 0, 2 * Math.PI, true);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.globalAlpha = 1*opacity;
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.font="30px Arial"
    ctx.fillStyle = "white";
    ctx.fillText(this.seq.toString(), this.pos[0]-8, this.pos[1]+10)
};

Beat.prototype.drawRing = function drawRing(ctx, opacity, radiusMul, color, hit=false){
    ctx.beginPath();
    ctx.globalAlpha = opacity;
    ctx.arc(this.pos[0], this.pos[1], this.radius*radiusMul, 0, 2 * Math.PI, true);
    if(hit){
        ctx.lineWidth = 5*radiusMul
    }
    ctx.strokeStyle = color || this.color;
    ctx.stroke();
}

// Beat.prototype.drawHit = function drawHit(ctx, time) {
//     ctx.beginPath();
//     ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true);
//     ctx.fillStyle = "red";
//     ctx.fill();
//     ctx.lineWidth = 5;
//     ctx.strokeStyle = "white";
//     ctx.stroke();
// };

module.exports = Beat;