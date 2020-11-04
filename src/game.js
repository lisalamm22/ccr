const Beat = require("./beat");

Game.BG_COLOR = "#000000";
Game.DIM_X = 1000;
Game.DIM_Y = 600;

function Game(options) {
    // this.beatmap = options.beatmap;
    this.beatmap = [
      {pos: [20, 20], time: 2000,},
      {pos: [60, 40], time: 2500,},
      {pos: [150, 200], time: 3000,},
      {pos: [230, 300], time: 4000,},
      {pos: [200, 290], time: 5000,},
      {pos: [600, 400], time: 6000,},
      {pos: [715, 200], time: 8000,},
      {pos: [230, 300], time: 9000,},
    ];
    this.activeBeats = [];
    this.currentTime = 0;
}

Game.prototype.draw = function draw(ctx) {
  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  ctx.globalAlpha=1;
  ctx.fillStyle = Game.BG_COLOR;
  ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
};

Game.prototype.makeBeats = function makeBeats(){
    this.beats = this.beatmap.map(beat => {
        return new Beat(beat)
    })
}

module.exports = Game;
