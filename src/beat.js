
const DEFAULTS = {
  TYPE: "PRESS",
  SHAPE: "DOT",
  SEQ: "",
  ACTIVE: false,
  COLOR: "blue",
  RADIUS: 50,
};

function Beat(options){
    this.pos = options.pos;
    this.time = options.time;
    this.type = options.type || DEFAULTS.TYPE;
    this.shape = options.shape || DEFAULTS.SHAPE;
    this.seq = options.seq || DEFAULTS.SEQ;
    this.active = options.active || DEFAULTS.ACTIVE;
    this.color = options.color || DEFAULTS.COLOR;
    this.radius = options.radius || DEFAULTS.RADIUS;
    this.opacity = 0;
}

Beat.prototype.draw = function draw(ctx,opacity) {
    ctx.beginPath();
    ctx.globalAlpha = opacity;
    ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";
    ctx.stroke();
};

Beat.prototype.drawRing = function drawRing(ctx, opacity, radiusMul){
    ctx.beginPath();
    ctx.globalAlpha = opacity;
    ctx.arc(this.pos[0], this.pos[1], this.radius*radiusMul, 0, 2 * Math.PI, true);
    ctx.strokeStyle = "white";
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