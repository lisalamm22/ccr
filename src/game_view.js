function GameView(game, ctx) {
  this.ctx = ctx;
  this.game = game;
  this.space = [0,0]
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
            this.space[0]=this.x
            this.space[1]=this.y
            let coor = "X : " + this.space[0] + ", Y : " + this.space[1];
            document.getElementById("keyp").innerHTML = coor;
        }
    })
    window.addEventListener("click", (e)=>{
        this.x = e.clientX;
        this.y = e.clientY;
        let coor = "X : " + this.x + ", Y : " + this.y;
        document.getElementById("keyp").innerHTML = coor;
    })
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
    this.game.beats.forEach((beat,idx) => {
      if (Math.abs(beat.time - time) <= 1000) {
        if(idx >= this.beatIdx){ //prevent duplicates in activeBeats
            if(Math.abs(beat.time - time) <= 500) {
                this.game.activeBeats.push(beat);
                this.beatIdx++;
            }
        }
        // this.game.activeBeats.forEach((activeBeat,idx2)=>{
            //event listener for mouse click
            //if click, and position within beat radius (if outside radius, ignore click), draw hit animation and remove from active beats
                //draw scenario 1: draw hit. remove from activebeats
            //if time difference exceeds 500, play miss animation and remove from active beats
                //skip/optional: draw scenario 2: if miss, flash red and indicate miss. otherwise, beat would disappear on its own without any indicator
        // }
        //if you didn't encounter draw scenarios 1 or 2, then you do draw scenario 3 below:
        //draw scenario 3: confirm still in active beats. draw as normal:
        beat.draw(this.ctx); 
      }
    });
  }
  console.log(this.game.activeBeats)
  this.lastTime = time;
  requestAnimationFrame(this.animate.bind(this));
};

module.exports = GameView;
