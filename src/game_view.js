const Util = require("./util");
const anime = require("animejs");

function GameView(game, ctx) {
  this.ctx = ctx;
  this.game = game;
  this.click = [0,0];
  this.release = [0,0];
  this.activeBeats = [];
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
            let coor = "Click: X : " + this.click[0] + ", Y : " + this.click[1];
            document.getElementById("keyp").innerHTML = coor;
            this.activeBeats.forEach((activeBeat, idx) => {
                //check if the mousepos was in any of the activeBeats 
                if (Util.dist(this.click, activeBeat.pos) < activeBeat.radius) {
                    //remove beat from activeBeats and put in hitBeats
                    let hitBeat = this.activeBeats.splice(idx, 1)[0];
                    let hitBeatStr = JSON.stringify(hitBeat);
                    this.hitBeats[hitBeatStr] = this.lastTime;
                    this.scoreHit(hitBeat);
                    let dist =
                        "Distance : " +
                        Util.dist(this.click, activeBeat.pos) +
                        ", Radius : " +
                        activeBeat.radius;
                    document.getElementById("click").innerHTML = dist;
                }
            });
        }
    })
    window.addEventListener("mousedown", (e)=>{
        this.click[0] = e.clientX;
        this.click[1] = e.clientY;
        this.clicked = true
        this.activeBeats.forEach((activeBeat,idx) => {
            if(activeBeat.type === "CLICK"){
            if( Util.dist(this.click, activeBeat.pos) < activeBeat.radius){
                let hitBeat = this.activeBeats.splice(idx, 1)[0];
                let hitBeatStr = JSON.stringify(hitBeat);
                this.hitBeats[hitBeatStr] = this.lastTime;
                this.scoreHit(hitBeat);
                let dist =
                  "Distance : " +
                  Util.dist(this.click, activeBeat.pos) +
                  ", Radius : " +
                  activeBeat.radius;
                  document.getElementById("click").innerHTML = dist;
            }}
            if(activeBeat.type === "DRAG"){
                if( !(Util.dist([this.x, this.y], activeBeat.pos) < activeBeat.radius) ){
                    this.activeBeats.splice(idx, 1)[0];
                }

            }
        })
        let coor = "Click: X : " + this.click[0] + ", Y : " + this.click[1];
        document.getElementById("keyp").innerHTML = coor;
    })

    window.addEventListener("mouseup", (e) => {
        this.clicked = false;
        this.release[0] = e.clientX;
        this.release[1] = e.clientY;
    })
}

GameView.prototype.isActiveBeat = function isActiveBeat(beat, idx, time){
    if (Math.abs(beat.time - time) <= 1000) {
        if (Math.abs(beat.time - time) <= 800) {
            //add beat to activeBeats and prevent duplicates
            if (idx >= this.beatIdx) {
                this.activeBeats.push(beat);
                this.beatIdx++;
            }
        } 
        else if (time - beat.time > 800) {
            let idx = this.activeBeats.indexOf(beat);
            if (idx !== -1) {
            this.activeBeats.splice(idx, 1);
            }
        }
    }
}

GameView.prototype.drawHitBeat = function drawHitBeat(ctx, beat, hitTime, time){
    const timeDelta =  time - hitTime; // 1000-2000
    const timeToFade = 1000

    if(timeDelta < timeToFade){
        let beatRadMul = (timeDelta / (2*timeToFade)) + 1;
        let ringRadMul = (timeDelta / timeToFade) + 1;
        let opacity = 1 - (timeDelta / timeToFade);
        beat.drawClick(this.ctx, opacity, beatRadMul);
        beat.drawRing(this.ctx, opacity, ringRadMul, null, true);
    }
}

GameView.prototype.drawBeat = function drawBeat(beat, time){
    const timeDelta =  time - beat.time; // 1000-2000
    const beatTime = 1000
    const activeBeatT = 500
    const inactiveBeatT = beatTime - activeBeatT
    
    if (Math.abs(timeDelta) <= beatTime) {    
        if(Object.keys(this.hitBeats).includes(JSON.stringify(beat))){
            let hitTime = this.hitBeats[JSON.stringify(beat)]
            this.drawHitBeat(this.ctx, beat, hitTime, time)
        }
        else if(timeDelta < -activeBeatT){
            let radiusMul = (-(timeDelta+ inactiveBeatT)/ inactiveBeatT) + 2;
            let opacity = (1+((timeDelta + inactiveBeatT) / inactiveBeatT));
            beat.drawClick(this.ctx, opacity);
            beat.drawRing(this.ctx, opacity, radiusMul, "white")
        }
        else if(timeDelta < 0){
            let radiusMul = (-(timeDelta+activeBeatT)/activeBeatT) + 2;
            let opacity = 1;
            beat.drawClick(this.ctx, opacity);
            beat.drawRing(this.ctx, opacity, radiusMul, "white");
        }
        else if(timeDelta < activeBeatT){
            let radiusMul = 1;
            let opacity = 1;
            beat.drawClick(this.ctx, opacity);
            beat.drawRing(this.ctx, opacity, radiusMul, "white");
        }
        else{
            let radiusMul = 1;
            let opacity = 1-((timeDelta - inactiveBeatT) / inactiveBeatT);
            beat.drawClick(this.ctx, opacity);
            beat.drawRing(this.ctx, opacity, radiusMul, "white");
        }
    }
}
GameView.prototype.drawDrag = function drawDrag(beat, time){
    const timeDelta =  time - beat.time; // 1000-2000
    const inactiveBeatT = 500
    const activeBeatT = 500
    const dragTime = beat.length*1000/60
    const beatTime = inactiveBeatT + activeBeatT + dragTime
    
    if (-timeDelta <= inactiveBeatT + activeBeatT 
        && timeDelta <= (beat.time + inactiveBeatT + dragTime)) {
        if(timeDelta < -activeBeatT){
            let radiusMul = (-(timeDelta+ inactiveBeatT)/ inactiveBeatT) + 2;
            let opacity = (1+((timeDelta + inactiveBeatT) / inactiveBeatT));
            beat.drawDrag(this.ctx, opacity, radiusMul);
            beat.drawClick(this.ctx, opacity);
            beat.drawRing(this.ctx, opacity, radiusMul, "white")
        }
        else if(timeDelta < 0){
            let radiusMul = (-(timeDelta+activeBeatT)/activeBeatT) + 2;
            let opacity = 1;
            beat.drawDrag(this.ctx, opacity, radiusMul);
            beat.drawClick(this.ctx, opacity);
            beat.moveDragBeat(time);
            beat.drawRing(this.ctx, opacity, radiusMul, "white");
        }
        else if(timeDelta < dragTime){
            let radiusMul = 1;
            let opacity = 1;
            beat.drawDrag(this.ctx, opacity, radiusMul);
            beat.drawClick(this.ctx, opacity);
            beat.moveDragBeat(time);
            beat.drawRing(this.ctx, opacity, radiusMul, "white");
        }
        else{
            let radiusMul = 1;
            let opacity = 1-((timeDelta - inactiveBeatT) / inactiveBeatT);
            beat.drawDrag(this.ctx, opacity, radiusMul);
            beat.drawClick(this.ctx, opacity);
            beat.moveDragBeat(time);
            beat.drawRing(this.ctx, opacity, radiusMul, "white");
        }
    }
}

GameView.prototype.scoreHit = function scoreHit(beat){
    const fullScore = 100;
    const activeBeatT = 500;
    let hitTime = this.hitBeats[JSON.stringify(beat)];
    this.score += fullScore * (activeBeatT-Math.abs(hitTime-beat.time))/activeBeatT
}

GameView.prototype.startAudio = function startAudio(audioURL){
    audioObj = new Audio(audioURL);
    audioObj.addEventListener("canplaythrough", (e) => {
        audioObj.play();
    })
}

GameView.prototype.start = function start(audioURL) {
    this.startAudio(audioURL)
    this.game.checkSeq();
    this.game.makeBeats();
    this.bindKeyHandlers();
    this.lastTime = 0;
    this.startTime = performance.now()
    this.beatIdx = 0;
    requestAnimationFrame(this.animate.bind(this));
};


GameView.prototype.animate = function animate(time) {
    this.lastTime = time - this.startTime;

    this.game.draw(this.ctx);
    if (this.game.beats.length !== 0) {
        this.game.beats.forEach((beat, idx) => {
            this.isActiveBeat(beat, idx, this.lastTime)
            if(beat.type === "CLICK"){
                this.drawBeat(beat, this.lastTime)
            }
            else{
                this.drawDrag(beat, this.lastTime)
            }
        })
    }
    requestAnimationFrame(this.animate.bind(this));
};

module.exports = GameView;
