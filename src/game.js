const Beat = require("./beat");

function Game(beatmap) {
    this.beatmap = beatmap;
}

Game.prototype.redraw = function redraw(ctx) {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.globalAlpha=1;
};

Game.prototype.checkSeq = function checkSeq(){
    let count = 1
    const downTime = 5000
    this.beatmap.forEach((beat, idx) => {
        if(idx === 0){
            let nextBeat = this.beatmap[idx+1]
            if(nextBeat.time - beat.time < downTime){
                beat.seq = count;
                count++; 
            }
        }
        else if(idx === this.beatmap.length-1){
            let prevBeat = this.beatmap[idx - 1];
            if (beat.time - prevBeat.time < downTime) {
              beat.seq = count;
            }
        }
        else{
            let prevBeat = this.beatmap[idx-1]
            let nextBeat = this.beatmap[idx+1]
            if (nextBeat.time - beat.time < downTime ) {
              beat.seq = count;
              count++;
            } 
            else if (beat.time - prevBeat.time < downTime) {
                beat.seq = count;
                count = 1;
            } 
            else {
              count = 1;
            }
        }
    })
}


Game.prototype.makeBeats = function makeBeats() {
  const windowX = window.innerWidth;
  const windowY = window.innerHeight;
  this.beats = this.beatmap.map((beat) => {
    beat.pos[0] = Math.floor( beat.pos[0] * windowX ) 
    beat.pos[1] = Math.floor( beat.pos[1] * windowY ) 
    return new Beat(beat);
  });
};

module.exports = Game;
