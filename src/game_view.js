const Util = require("./util");

function GameView(game, ctx, options) {
  this.ctx = ctx;
  this.game = game;
  this.click = [0,0];
  this.mousedown = false;
  this.activeBeats = [];
  this.hitBeats = [];
  this.score = 0;
  this.combo = 0;
  this.maxCombo = 0;
  this.volume = (options.volume/100);
  this.mute = options.mute;
  this.restart = false;
  this.pause = false;
  this.unpause = false;
  this.pausedTime = 0;
  this.audioObj = options.audioObj;
  this.audioObj.volume = this.mute ? 0 : this.volume;
  this.restartCount = 0
  this.clickAudio = new Audio("./src/assets/sounds/soft-hitclap.wav")
  this.clickAudio.volume = this.audioObj.volume/3
}
GameView.prototype.bindKeyHandlers = function bindKeyHandlers(){
    document.getElementById("game-canvas").addEventListener("mousemove", (e) => {
        const canvasElement = document.getElementById("game-canvas")
        this.x = e.clientX - (window.innerWidth - canvasElement.width)/2;
        this.y = e.clientY - (window.innerHeight - canvasElement.height) / 2;
    });
    window.addEventListener("keydown", (e)=>{
        e.preventDefault();
        e.stopImmediatePropagation();
        if(e.code === "KeyZ"){
            e.preventDefault();
            e.stopImmediatePropagation();
            console.log(`X: ${(this.x/window.innerWidth).toFixed(2)} Y: ${(this.y/window.innerHeight).toFixed(2)} Time: ${Math.floor(this.lastTime)}`)
            this.click[0]=this.x
            this.click[1]=this.y
            this.mousedown = true;
            this.activeBeats.forEach((activeBeat, idx) => {
                this.checkClick(activeBeat, idx)
            });
        }
    })
    window.addEventListener("keyup", (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        if(e.code === "KeyZ"){
            e.preventDefault();
            e.stopImmediatePropagation();
            this.mousedown = false;
        }
    });
    window.addEventListener("mousedown", (e)=>{
        console.log(`X: ${(e.clientX/window.innerWidth).toFixed(2)} Y: ${(e.clientY/window.innerHeight).toFixed(2)} Time: ${Math.floor(this.lastTime)}`)
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

    const restartButton = document.getElementById("restart-btn");
    restartButton.addEventListener("click", ()=> {
        unpauseButton.classList.add("hidden");
        pauseButton.classList.remove("hidden");
        this.restart = true;
        this.restartGame();
    })
    
    const pauseButton = document.getElementById("pause-btn");
    const unpauseButton = document.getElementById("unpause-btn");
    pauseButton.addEventListener("click", ()=> {
        this.pauseGame();
    })
    unpauseButton.addEventListener("click", ()=> {
        this.lastTime -= (1000/60);
        this.unpauseGame();
    })
    window.addEventListener("keyup", (e) => {
        if(e.code === "Escape" && !this.pause){
            e.preventDefault();
            e.stopImmediatePropagation();
            this.pauseGame();
        }
        else{
            e.preventDefault();
            e.stopImmediatePropagation();
            this.unpauseGame();
        }
    })

    const volumeButtonGame = document.getElementById("volume-btn-GV");
    const volumeInputGame = document.getElementById("volume-GV");
    const muteButtonGame = document.getElementById("mute-GV")
    const volumeInputStart = document.getElementById("volume-start");
    const volumeInputSongs = document.getElementById("volume-songs");

    volumeButtonGame.addEventListener("click", () => {
        if (volumeInputGame.className === "hidden") {
            volumeInputGame.classList.remove("hidden")
            muteButtonGame.classList.remove("hidden")
        }
        else {
            volumeInputGame.classList.add("hidden")
            muteButtonGame.classList.add("hidden")
        }
    });

    muteButtonGame.addEventListener("click", () => {
        if (!this.mute) {
            this.mute = true;
            this.audioObj.volume = 0;
            this.clickAudio.volume = 0;
            volumeInputStart.value = 0;
            volumeInputSongs.value = 0;
            volumeInputGame.value = 0;
        }
        else {
            this.mute = false;
            this.audioObj.volume = this.volume;
            this.clickAudio.volume = this.audioObj.volume/3;
            volumeInputStart.value = this.volume*100
            volumeInputSongs.value = this.volume * 100
            volumeInputGame.value = this.volume * 100
        }
    })

    volumeInputGame.addEventListener("change", (e) => {
        this.volume = e.target.value / 100;
        this.audioObj.volume = this.volume;
        this.clickAudio.volume = this.audioObj.volume/3;
        volumeInputStart.value = e.target.value;
        volumeInputSongs.value = e.target.value;
    })

    const finalScore = document.querySelector(".final-score")
    this.audioObj.addEventListener("ended", () => {
        finalScore.classList.remove("hidden")
        document.getElementById("final-score").innerHTML = `Score ${Math.floor(this.score)}`;
        document.getElementById("max-combo").innerHTML = `Max Combo ${this.maxCombo}`;
    })

    const replayButton = document.getElementById("replay-btn")
    replayButton.addEventListener("click", () => {
        finalScore.classList.add("hidden")
        this.restartGame();
    })

    GameView.prototype.pauseGame = function pauseGame() {
        this.pause = true;
        this.audioObj.pause();
        pauseButton.classList.add("hidden");
        unpauseButton.classList.remove("hidden");
    };
    GameView.prototype.unpauseGame = function unpauseGame() {
        this.unpause = true;
        this.audioObj.play();
        unpauseButton.classList.add("hidden");
        pauseButton.classList.remove("hidden");
        requestAnimationFrame(this.animate.bind(this));
    }

};

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
        hitBeat.hitTime = this.lastTime;
        this.hitBeats.push(hitBeat)
        this.scoreHit(hitBeat);
        this.clickAudio.play();
        this.updateCombo(idx);
    }
}

GameView.prototype.updateCombo = function updateCombo(idx){
    if (idx === 0){
        this.combo += 1;
        if(this.combo > this.maxCombo){ this.maxCombo = this.combo}
    }
    else{
        if(this.combo > this.maxCombo){ this.maxCombo = this.combo}
        this.combo = 0;
    }
}

GameView.prototype.checkDrag = function checkDrag(dragBeat, time){
    const timeDelta = time - dragBeat.time;
    const dragTime = (dragBeat.length * 1000) / 60 / 2;
    const activeBeatT = 500;
    if (Math.abs(timeDelta - dragTime) <= (1000/60)*2 && dragBeat.held){
        if (Util.dist([this.x, this.y], dragBeat.pos) < dragBeat.radius) {
            this.clickAudio.play();
        }
    }
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
    const timeDelta =  time - hitTime; 
    const timeToFade = 1000

    if(timeDelta < timeToFade){
        let beatRadMul = (timeDelta / (2*timeToFade)) + 1;
        let ringRadMul = (timeDelta / timeToFade) + 1;
        let opacity = 1 - (timeDelta / timeToFade);
        beat.drawClick(ctx, opacity, beatRadMul);
        beat.drawRing(ctx, opacity, ringRadMul, null, true);
        this.drawHit(beat, beat.hitScore)
    }
}
GameView.prototype.drawHitDrag = function drawHitDrag(ctx, beat, startTime, time){
    const timeDelta =  time - startTime; 
    const timeToFade = 1000
    
    if(timeDelta < timeToFade){
        let ringRadMul = (timeDelta / timeToFade) + 1;
        let opacity = 1 - (timeDelta / timeToFade);
        beat.drawRing(ctx, opacity, ringRadMul, null, true);
        this.drawHit(beat, beat.hitScore)
    }
}

GameView.prototype.drawBeat = function drawBeat(beat, time){
    const timeDelta =  time - beat.time;
    const beatTime = 1000
    const activeBeatT = 500
    const inactiveBeatT = beatTime - activeBeatT
    if (Math.abs(timeDelta) <= beatTime) {    
        if(this.hitBeats.includes(beat)){
            this.drawHitBeat(this.ctx, beat, beat.hitTime, time)
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
    const dragTime = beat.length*1000/60/2
    const addDragTime = Math.max(0, (inactiveBeatT+activeBeatT-dragTime))
    const beatTime = inactiveBeatT + activeBeatT + dragTime
    let radiusMul;
    let opacity;
    
    if (-timeDelta <= inactiveBeatT + activeBeatT 
        && timeDelta <= (inactiveBeatT + dragTime + addDragTime)) {
        if(timeDelta < -activeBeatT){
            radiusMul = (-(timeDelta+ inactiveBeatT)/ inactiveBeatT) + 2;
            opacity = (1+((timeDelta + inactiveBeatT) / inactiveBeatT));
            beat.drawClick(this.ctx, opacity);
            beat.drawRing(this.ctx, opacity, radiusMul, "white");
        }
        else if(timeDelta < 0){
            if(this.hitBeats.includes(beat)){
                this.drawHitDrag(this.ctx, beat, beat.hitTime, time)
                opacity = 1
            }
            else{
                radiusMul = (-(timeDelta+activeBeatT)/activeBeatT) + 2;
                opacity = 1;
                beat.drawRing(this.ctx, opacity, radiusMul, "white");
            }
            beat.drawClick(this.ctx, opacity);
            beat.moveDragBeat(time, this.restartCount);
        }
        else if(timeDelta < dragTime){
            if(this.hitBeats.includes(beat)){
                this.drawHitDrag(this.ctx, beat, beat.hitTime, time)
                opacity = 1;
            }
            else{
                radiusMul = 1;
                opacity = 1;
                beat.drawRing(this.ctx, opacity, radiusMul, "white");
            }
            beat.drawClick(this.ctx, opacity);
            beat.moveDragBeat(time, this.restartCount);
        }
        else if(timeDelta < 1000){
            if(this.hitBeats.includes(beat)){
                this.drawHitDrag(this.ctx, beat, beat.time+dragTime, time)
            }
            radiusMul = 1;
            opacity = 1;
            beat.drawClick(this.ctx, opacity);
            beat.drawRing(this.ctx, opacity, radiusMul, "white");
        }
        else{
            if(this.hitBeats.includes(beat) && this.mousedown){
                if (Util.dist([this.x, this.y], beat.pos) < beat.radius) {
                    this.drawHitDrag(this.ctx, beat, beat.time+dragTime, time)
                }
            }
            radiusMul = 1;
            opacity = 1-((timeDelta-dragTime-addDragTime) / inactiveBeatT);
            beat.drawClick(this.ctx, opacity);
            beat.drawRing(this.ctx, opacity, radiusMul, "white");
        }
        beat.drawDrag(this.ctx, opacity, radiusMul);
        
    }
}

GameView.prototype.scoreHit = function scoreHit(beat){
    const fullScore = 100;
    const activeBeatT = 500;
    hitScore = Math.abs(fullScore * (activeBeatT-Math.abs(beat.hitTime-beat.time))/activeBeatT)
    this.score += hitScore
    beat.hitScore = hitScore

}

GameView.prototype.scoreDrag = function scoreDrag(hit){
    if(hit){
        this.score += 100;
    }
}

GameView.prototype.drawHit = function drawHit(beat, hitScore){
    if(hitScore > 80){
        console.log("Perfect")
        beat.drawHitA(this.ctx)
    }
    else if(hitScore > 60){
        console.log("Great")
        beat.drawHitB(this.ctx)
    }
    else if(hitScore > 40){
        console.log("Good")
        beat.drawHitC(this.ctx)
    }
    else if(hitScore > 20){
        console.log("OK")
        beat.drawHitD(this.ctx)
    }
    else{
        console.log("Miss")
        beat.drawHitF(this.ctx)
    }
}

GameView.prototype.playAudio = function playAudio(){
    this.audioObj.addEventListener("canplaythrough", (e) => {
        this.audioObj.play();
    })
}

GameView.prototype.start = function start() {
    this.audioObj.currentTime = 0;
    this.playAudio()
    this.game.checkSeq();
    this.game.makeBeats();
    this.bindKeyHandlers();
    this.lastTime = 0;
    this.startTime = performance.now()
    this.beatIdx = 0;
    requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.restartGame = function restartGame() {
    this.audioObj.currentTime = 0;
    this.playAudio()
    this.game.remakeBeats();
    console.log(this.game)
    this.lastTime = 0;
    this.startTime = performance.now()
    this.beatIdx = 0;
    this.activeBeats = [];
    this.hitBeats = [];
    this.combo = 0;
    this.score = 0;
    this.restart = false;
    this.pause = false;
    this.unpause = false;
    this.pausedTime = 0;
    this.restartCount += 1
    requestAnimationFrame(this.animate.bind(this));
}

GameView.prototype.animate = function animate(time) {
    if(this.unpause){
        this.pausedTime = time - (this.startTime + this.lastTime)
        this.pause = false;
        this.unpause = false;
    }
    this.lastTime = time - this.startTime - this.pausedTime;
    this.game.redraw(this.ctx);
    document.getElementById("score").innerHTML = `Score ${Math.floor(this.score)}`;
    document.getElementById("combo").innerHTML = `Combos ${this.combo}`;
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
    if (this.restart){
        return null
    }
    else if(this.pause){
        return null
    }
    else{
        requestAnimationFrame(this.animate.bind(this));
    }
};

module.exports = GameView;
