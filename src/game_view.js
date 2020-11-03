const Util = require("./util");
const anime = require("animejs");

function GameView(game, ctx) {
  this.ctx = ctx;
  this.game = game;
  this.click = [0,0];
  this.hitBeats = [];
}
GameView.prototype.bindKeyHandlers = function bindKeyHandlers(){
    document.getElementById("game-canvas").addEventListener("mousemove", (e) => {
        this.x = e.clientX;
        this.y = e.clientY;
        let coor = "X coords: " + this.x + ", Y coords: " + this.y;
        document.getElementById("demo").innerHTML = coor;
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
                    this.hitBeats.push(this.game.activeBeats.splice(idx, 1)[0])
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
                this.hitBeats.push(this.game.activeBeats.splice(idx, 1)[0]);
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

GameView.prototype.drawBeat = function drawBeat(beat, time){
    if (Math.abs(beat.time - time) <= 1000) {
        if(this.hitBeats.includes(beat)){
            console.log("hitbeat")
        }
        else if(this.game.activeBeats.includes(beat)){
            beat.drawActive(this.ctx)
        }
        else{
            beat.draw(this.ctx)
        } 
    }
}

GameView.prototype.start = function start() {
  this.bindKeyHandlers();
  this.game.makeBeats();
  this.lastTime = 0;
  this.beatIdx = 0;
  requestAnimationFrame(this.animate.bind(this));
};


GameView.prototype.animate = function animate(time) {
    const timeDelta = time - this.lastTime;

    this.game.draw(this.ctx);
    if (this.game.beats.length !== 0) {
        this.game.beats.forEach((beat, idx) => {
            this.isActiveBeat(beat, idx, time)
            this.drawBeat(beat, time)
        })
    }
    this.lastTime = time;
    requestAnimationFrame(this.animate.bind(this));
};

module.exports = GameView;
