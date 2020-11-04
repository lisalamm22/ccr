const Util = require("./util");
const anime = require("animejs");

function GameView(game, ctx) {
  this.ctx = ctx;
  this.game = game;
  this.click = [0,0];
  this.hitBeats = {};
  this.score = 0;
}
GameView.prototype.bindKeyHandlers = function bindKeyHandlers(){
    document.getElementById("game-canvas").addEventListener("mousemove", (e) => {
        this.x = e.clientX;
        this.y = e.clientY;
        let coor = "X coords: " + this.x + ", Y coords: " + this.y;
        document.getElementById("demo").innerHTML = coor;
        document.getElementById("score").innerHTML = "Score: " + this.score;
    });
    window.addEventListener("keydown", (e)=>{
        if(e.keyCode === 32){
            this.click[0]=this.x
            this.click[1]=this.y
            let coor = "X : " + this.click[0] + ", Y : " + this.click[1];
            document.getElementById("keyp").innerHTML = coor;
            this.game.activeBeats.forEach((activeBeat, idx) => {
                //check if the mousepos was in any of the activeBeats 
                if (Util.dist(this.click, activeBeat.pos) < activeBeat.radius) {
                    //remove beat from activeBeats and put in hitBeats
                    let hitBeat = this.game.activeBeats.splice(idx, 1)[0];
                    let hitBeatStr = JSON.stringify(hitBeat);
                    this.hitBeats[hitBeatStr] = this.lastTime;
                    this.scoreHit(hitBeat);
                    let coor2 =
                        "X : " +
                        Util.dist(this.click, activeBeat.pos) +
                        ", Y : " +
                        activeBeat.radius;
                    document.getElementById("click").innerHTML = coor2;
                }
            });
        }
    })
    window.addEventListener("click", (e)=>{
        this.click[0] = e.clientX;
        this.click[1] = e.clientY;
        this.game.activeBeats.forEach((activeBeat,idx) => {
            if( Util.dist(this.click, activeBeat.pos) < activeBeat.radius){
                let hitBeat = this.game.activeBeats.splice(idx, 1)[0];
                let hitBeatStr = JSON.stringify(hitBeat);
                this.hitBeats[hitBeatStr] = this.lastTime;
                this.scoreHit(hitBeat);
                let coor2 =
                  "X : " +
                  Util.dist(this.click, activeBeat.pos) +
                  ", Y : " +
                  activeBeat.radius;
                  document.getElementById("click").innerHTML = coor2;
            }
        })
        let coor = "X : " + this.click[0] + ", Y : " + this.click[1];
        document.getElementById("keyp").innerHTML = coor;
    })
}

GameView.prototype.isActiveBeat = function isActiveBeat(beat, idx, time){
    if (Math.abs(beat.time - time) <= 1000) {
        if (Math.abs(beat.time - time) <= 800) {
            //add beat to activeBeats and prevent duplicates
            if (idx >= this.beatIdx) {
                this.game.activeBeats.push(beat);
                this.beatIdx++;
            }
        } 
        else if (time - beat.time > 800) {
            let idx = this.game.activeBeats.indexOf(beat);
            if (idx !== -1) {
            this.game.activeBeats.splice(idx, 1);
            }
        }
    }
}

GameView.prototype.drawHitBeat = function drawHitBeat(ctx, beat, hitTime, time){
    const timeDelta =  time - hitTime; // 1000-2000

    if(timeDelta < 100){
        let radiusMul = (timeDelta / 100) + 1;
        let opacity = 1 - ((timeDelta - 100) / 100);
        beat.draw(this.ctx, opacity);
        beat.drawRing(this.ctx, opacity, radiusMul);
    }
}

GameView.prototype.drawBeat = function drawBeat(beat, time){
    const timeDelta =  time - beat.time; // 1000-2000
    
    if (Math.abs(timeDelta) <= 1000) {    
        if(Object.keys(this.hitBeats).includes(JSON.stringify(beat))){
            let hitTime = this.hitBeats[JSON.stringify(beat)]
            this.drawHitBeat(this.ctx, beat, hitTime, time)
        }
        else if(timeDelta < -500){
            let radiusMul = (-(timeDelta+500)/500) + 2;
            let opacity = (1+((timeDelta + 500) / 500));
            beat.draw(this.ctx, opacity);
            beat.drawRing(this.ctx, opacity, radiusMul)
        }
        else if(timeDelta < 0){
            let radiusMul = (-(timeDelta+500)/500) + 2;
            let opacity = 1;
            beat.draw(this.ctx, opacity);
            beat.drawRing(this.ctx, opacity, radiusMul)
        }
        else if(timeDelta < 500){
            let radiusMul = 1;
            let opacity = 1;
            beat.draw(this.ctx, opacity);
            beat.drawRing(this.ctx, opacity, radiusMul)
        }
        else{
            let radiusMul = 1;
            let opacity = 1-((timeDelta - 500) / 500);
            beat.draw(this.ctx, opacity);
            beat.drawRing(this.ctx, opacity, radiusMul)
        }
    }
}

GameView.prototype.scoreHit = function scoreHit(beat){
    let fullScore = 100;
    let hitTime = this.hitBeats[JSON.stringify(beat)];
    this.score += fullScore * (500-Math.abs(hitTime-beat.time))/500
}

GameView.prototype.start = function start() {
  this.bindKeyHandlers();
  this.game.makeBeats();
  this.lastTime = 0;
  this.beatIdx = 0;
  requestAnimationFrame(this.animate.bind(this));
};


GameView.prototype.animate = function animate(time) {
    // const timeDelta = time - this.lastTime;
    this.lastTime = time;

    this.game.draw(this.ctx);
    if (this.game.beats.length !== 0) {
        this.game.beats.forEach((beat, idx) => {
            this.isActiveBeat(beat, idx, time)
            this.drawBeat(beat, time)
        })
    }
    requestAnimationFrame(this.animate.bind(this));
};

module.exports = GameView;
