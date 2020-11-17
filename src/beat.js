const Util = require("./util");

const DEFAULTS = {
  TYPE: "CLICK",
  LENGTH: 0,
  DIR: 0, // 0 to 359
  SEQ: "",
  COLOR: "rgba(255, 255, 255, .75)",
  RADIUS: 50,
};

function Beat(options){
    this.pos = options.pos.slice(0);
    this.startPos = options.pos.slice(0);
    this.time = options.time;
    this.type = options.type || DEFAULTS.TYPE;
    this.length = options.length || DEFAULTS.LENGTH;
    this.dir = options.dir || DEFAULTS.DIR;
    this.seq = options.seq || DEFAULTS.SEQ;
    this.color = options.color || Util.randomColor(0.75) || DEFAULTS.COLOR;
    this.radius = options.radius || DEFAULTS.RADIUS;
    this.opacity = 0;
    this.held = true;
}

Beat.prototype.drawClick = function draw(ctx, opacity, radiusMul=1, seq) {
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
    if(hit){
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;
    }
    else{
        ctx.shadowBlur = 0;
    }
    ctx.stroke();
}

Beat.prototype.drawDrag = function drawDrag(ctx, opacity, radiusMul){
    const rad = (this.dir * 2 * Math.PI) / 360;

    const x1 = this.startPos[0]- this.radius * Math.sin(rad);
    const y1 = this.startPos[1]- this.radius * Math.cos(rad);
    
    const x2 = x1 + this.length * Math.cos(rad);
    const y2 = y1 - this.length * Math.sin(rad);
    
    const x3 = x2+ this.radius * Math.sin(rad);
    const y3 = y2+ this.radius * Math.cos(rad);
    const alphai3 = -rad - 0.5 * Math.PI
    const alphaf3 = -rad - 1.5 * Math.PI
    
    const x4 = this.startPos[0] + this.radius * Math.sin(rad);
    const y4 = this.startPos[1] + this.radius * Math.cos(rad);

    const x5 = x4 - this.radius * Math.sin(rad);
    const y5 = y4 - this.radius * Math.cos(rad);
    const alphai5 = -rad + 0.5 * Math.PI;
    const alphaf5 = -rad + 1.5 * Math.PI;
    
    ctx.beginPath();
    ctx.globalAlpha = 1*opacity;
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";
    ctx.moveTo( x1, y1 );
    ctx.lineTo( x2, y2 );
    ctx.arc(x3, y3, this.radius, alphai3, alphaf3);
    ctx.lineTo(x4,y4);
    ctx.arc(x5, y5, this.radius, alphai5, alphaf5);
    ctx.stroke();
}

Beat.prototype.getEndPos = function getEndPos(){
    let x = this.startPos[0]
    let y = this.startPos[1]

    let deltaX = this.length * Math.cos(this.dir * 2 * Math.PI / 360)
    let deltaY = this.length * Math.sin(this.dir * 2 * Math.PI / 360)

    this.endPos = [x + deltaX, y + deltaY]
}

Beat.prototype.moveDragBeat = function moveDragBeat(time, restartCount){
    const timeDelta = time - this.time;
    const speedMul = 2/(restartCount+1)

    if (timeDelta >= 0){
        let deltaX = Math.cos((this.dir * 2 * Math.PI) / 360);
        let deltaY = Math.sin((this.dir * 2 * Math.PI) / 360);

        this.pos[0] = this.pos[0] + (deltaX * speedMul);
        this.pos[1] = this.pos[1] - (deltaY * speedMul);
    }
}

module.exports = Beat;