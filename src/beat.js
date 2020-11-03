
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
}

Beat.prototype.draw = function draw(ctx) {
  ctx.fillStyle = this.color;

  ctx.beginPath();
  ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true);
  ctx.fill();
};

Beat.prototype.drawActive = function drawActive(ctx) {
  ctx.fillStyle = 'red';

  ctx.beginPath();
  ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true);
  ctx.fill();
};

module.exports = Beat;