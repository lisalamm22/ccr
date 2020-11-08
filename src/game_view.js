const Util = require("./util");
// const anime = require("animejs");

function GameView(game, ctx, options) {
  this.ctx = ctx;
  this.game = game;
  this.click = [0,0];
  this.mousedown = false;
  this.activeBeats = [];
  this.hitBeats = {};
  this.score = 0;
  this.audioURL = options.audioURL;
  this.volume = (options.volume/100) || 0.5

  //create audio for game
  this.audioObj = new Audio(this.audioURL);
  this.audioObj.volume = this.volume;
}
GameView.prototype.bindKeyHandlers = function bindKeyHandlers(){
    document.getElementById("game-canvas").addEventListener("mousemove", (e) => {
        const canvasElement = document.getElementById("game-canvas")
        this.x = e.clientX - (window.innerWidth - canvasElement.width)/2;
        this.y = e.clientY - (window.innerHeight - canvasElement.height) / 2;
    });
    window.addEventListener("keydown", (e)=>{
        if(e.keyCode === 32){
            this.click[0]=this.x
            this.click[1]=this.y
            this.activeBeats.forEach((activeBeat, idx) => {
                this.checkClick(activeBeat, idx)
            });
        }
    })
    window.addEventListener("keyup", (e) => {
        if(e.keyCode === 32){
            this.mousedown = false;
        }
    });
    window.addEventListener("mousedown", (e)=>{
        const canvasElement = document.getElementById("game-canvas");
        this.click[0] = e.clientX - (window.innerWidth - canvasElement.width)/2;
        this.click[1] = e.clientY - (window.innerHeight - canvasElement.height) / 2;
        this.mousedown = true;
        this.activeBeats.forEach((activeBeat,idx) => {
                this.checkClick(activeBeat, idx);
        })
    })

    window.addEventListener("mouseup", (e) => {
        this.mousedown = false;
    })

    const volumeInput = document.getElementById("volume-GV")
    volumeInput.addEventListener("change", (e) => {
        this.audioObj.volume = e.target.value/100
        console.log(`gameview volume: ${e.target.value}`)
    })
}

GameView.prototype.isActiveBeat = function isActiveBeat(beat, idx, time){
    if (Math.abs(beat.time - time) <= 1000) {
        if (Math.abs(beat.time - time) <= 800) {
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

GameView.prototype.checkClick = function checkClick(activeBeat, idx){
  if (Util.dist(this.click, activeBeat.pos) < activeBeat.radius) {
    let hitBeat = this.activeBeats.splice(idx, 1)[0];
    let hitBeatStr = JSON.stringify(hitBeat);
    this.hitBeats[hitBeatStr] = this.lastTime;
    this.scoreHit(hitBeat);
  }
}

GameView.prototype.checkDrag = function checkDrag(dragBeat, time){
    const timeDelta = time - dragBeat.time;
    const dragTime = (dragBeat.length * 1000) / 60;
    const activeBeatT = 500;
    if (timeDelta > activeBeatT && timeDelta <= dragTime){
        if (Util.dist([this.x, this.y], dragBeat.pos) < dragBeat.radius) {
            if(!this.mousedown){
                this.scoreDrag(false);
                dragBeat.held = false;
            }
        } 
        else {
            this.scoreDrag(false);
            dragBeat.held = false;
        }
    }
    else if (dragBeat.held && timeDelta > dragTime)
    {
        this.scoreDrag(true)
        dragBeat.held=false;
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
    const timeDelta =  time - beat.time;
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
    const timeDelta =  time - beat.time;
    const inactiveBeatT = 500
    const activeBeatT = 500
    const dragTime = beat.length*1000/60
    const beatTime = inactiveBeatT + activeBeatT + dragTime
    let radiusMul;
    let opacity;
    
    if (-timeDelta <= inactiveBeatT + activeBeatT 
        && timeDelta <= (inactiveBeatT + dragTime)) {
        if(timeDelta < -activeBeatT){
            radiusMul = (-(timeDelta+ inactiveBeatT)/ inactiveBeatT) + 2;
            opacity = (1+((timeDelta + inactiveBeatT) / inactiveBeatT));
        }
        else if(timeDelta < 0){
            radiusMul = (-(timeDelta+activeBeatT)/activeBeatT) + 2;
            opacity = 1;
            beat.moveDragBeat(time);
        }
        else if(timeDelta < dragTime){
            radiusMul = 1;
            opacity = 1;
            beat.moveDragBeat(time);
        }
        else{
            radiusMul = 1;
            opacity = 1-((timeDelta - inactiveBeatT) / inactiveBeatT);
        }
        beat.drawDrag(this.ctx, opacity, radiusMul);
        beat.drawClick(this.ctx, opacity);
        beat.drawRing(this.ctx, opacity, radiusMul, "white");
        
    }
}

GameView.prototype.scoreHit = function scoreHit(beat){
    const fullScore = 100;
    const activeBeatT = 500;
    let hitTime = this.hitBeats[JSON.stringify(beat)];
    this.score += fullScore * (activeBeatT-Math.abs(hitTime-beat.time))/activeBeatT
}

GameView.prototype.scoreDrag = function scoreDrag(hit){
    if(hit){
        this.score += 100;
    }
}

GameView.prototype.playAudio = function playAudio(){
    this.audioObj.addEventListener("canplaythrough", (e) => {
        this.audioObj.play();
    })
}
// GameView.prototype.changeAudioVol = function changeAudioVol(){
//     this.audioObj.addEventListener("canplaythrough", (e) => {
//         this.audioObj.play();
//     })
// }

GameView.prototype.start = function start() {
    this.playAudio()
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
                if(beat.held){
                    this.checkDrag(beat, this.lastTime)
                }
            }
        })
    }
    requestAnimationFrame(this.animate.bind(this));
};

module.exports = GameView;
