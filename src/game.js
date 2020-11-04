const Beat = require("./beat");

Game.BG_COLOR = "#000000";
Game.DIM_X = 1000;
Game.DIM_Y = 600;

function Game(options) {
    // this.beatmap = options.beatmap;
    this.beatmap = [
      {pos: [20, 20], time: 2000,},
      {pos: [460, 40], time: 2500,},
      {pos: [850, 200], time: 3000,},
      {pos: [230, 300], time: 4000,},
      {pos: [200, 290], time: 5000,},
      {pos: [600, 400], time: 6000,},
      {pos: [715, 200], time: 8000,},
      {pos: [230, 300], time: 9000,},
    ];
    // this.activeBeats = [];
}

Game.prototype.draw = function draw(ctx) {
  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  ctx.globalAlpha=1;
  ctx.fillStyle = Game.BG_COLOR;
  ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
};

Game.prototype.checkSeq = function checkSeq(){
    let count = 1
    const downTime = 1000
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
  this.beats = this.beatmap.map((beat) => {
    return new Beat(beat);
  });
};

module.exports = Game;
