const Beat = require("./beat");

Game.BG_COLOR = "#000000";
Game.DIM_X = 1000;
Game.DIM_Y = 600;

function Game(options) {
    // this.beatmap = options.beatmap;
    this.beatmap = [
      { pos: [20, 20], time: 2000 },
      { pos: [460, 40], time: 2500 },
      { pos: [850, 200], time: 3000, type: "DRAG", length: 100, dir: 300 },
      { pos: [230, 300], time: 4000 },
      { pos: [200, 290], time: 5000 },
      { pos: [600, 400], time: 6000 },
      { pos: [715, 200], time: 8000 },
      { pos: [230, 300], time: 9000 },
    ];
    // this.beatmap = [
    //   { pos: [590, 238], time: 800 },
    //   { pos: [250, 308], time: 2140 },
    //   { pos: [466, 92], time: 3480 },
    //   { pos: [892, 36], time: 4160 },
    //   { pos: [944, 273], time: 4790 },
    //   { pos: [585, 178], time: 5480 },
    //   { pos: [343, 504], time: 6130.8 },
    //   { pos: [588, 531], time: 7480 },
    //   { pos: [523, 207], time: 9136 },
    //   { pos: [53, 82], time: 9809.2 },
    //   { pos: [594, 135], time: 10129.6 },
    //   { pos: [0, 519], time: 10789.2 },
    //   { pos: [177, 499], time: 11465.2 },
    //   { pos: [131, 302], time: 11790.8 },
    //   { pos: [268, 428], time: 12803.6 },
    //   { pos: [531, 485], time: 13466 },
    //   { pos: [105, 342], time: 14130.8 },
    //   { pos: [930, 81], time: 15461.2 },
    //   { pos: [501, 191], time: 16126 },
    //   { pos: [762, 571], time: 16800 },
    //   { pos: [592, 121], time: 18131.2 },
    //   { pos: [463, 214], time: 18800 },
    //   { pos: [529, 263], time: 19804.4 },
    //   { pos: [495, 95], time: 20058.4 },
    //   { pos: [535, 464], time: 20800 },
    //   { pos: [859, 375], time: 21460.4 },
    //   { pos: [31, 277], time: 23480 },
    //   { pos: [328, 283], time: 24137.2 },
    //   { pos: [825, 332], time: 24804.8 },
    //   { pos: [938, 86], time: 26124 },
    //   { pos: [299, 263], time: 26792 },
    //   { pos: [984, 286], time: 27460 },
    //   { pos: [702, 90], time: 28744 },
    //   { pos: [648, 310], time: 29449.6 },
    //   { pos: [20, 520], time: 30131.2 },
    //   { pos: [455, 135], time: 31456 },
    //   { pos: [266, 243], time: 32126.4 },
    //   { pos: [551, 270], time: 32778 },
    //   { pos: [355, 256], time: 34132.4 },
    //   { pos: [469, 109], time: 34789.6 },
    //   { pos: [300, 399], time: 35343.2 },
    //   { pos: [976, 324], time: 35785.2 },
    //   { pos: [992, 494], time: 36790.4 },
    //   { pos: [886, 1], time: 37454.8 },
    //   { pos: [709, 428], time: 38122.8 },
    //   { pos: [630, 247], time: 39404 },
    //   { pos: [893, 99], time: 40069.2 },
    //   { pos: [939, 418], time: 40802.4 },
    //   { pos: [472, 324], time: 42110.8 },
    //   { pos: [383, 468], time: 42784 },
    //   { pos: [765, 484], time: 43440.8 },
    //   { pos: [661, 535], time: 43788.8 },
    //   { pos: [777, 227], time: 44806.8 },
    //   { pos: [169, 76], time: 45463.6 },
    //   { pos: [978, 448], time: 46126 },
    //   { pos: [310, 492], time: 46465.2 },
    //   { pos: [988, 23], time: 47462 },
    //   { pos: [526, 518], time: 48143.2 },
    //   { pos: [650, 313], time: 48787.6 },
    //   { pos: [304, 270], time: 50143.2 },
    //   { pos: [6, 343], time: 51468.4 },
    //   { pos: [90, 133], time: 52812.4 },
    //   { pos: [197, 104], time: 54143.2 },
    //   { pos: [771, 302], time: 55466.4 },
    //   { pos: [767, 233], time: 56129.2 },
    //   { pos: [511, 74], time: 56800.4 },
    //   { pos: [561, 59], time: 57148 },
    //   { pos: [307, 153], time: 58018 },
    //   { pos: [316, 339], time: 58803.2 },
    //   { pos: [550, 478], time: 61126.4 },
    //   { pos: [895, 376], time: 61455.6 },
    //   { pos: [530, 515], time: 62460 },
    //   { pos: [762, 40], time: 63609.6 },
    //   { pos: [175, 110], time: 65049.2 },
    //   { pos: [385, 570], time: 66480.4 },
    //   { pos: [692, 203], time: 67810.8 },
    //   { pos: [237, 36], time: 69452.8 },
    //   { pos: [568, 543], time: 70111.2 },
    //   { pos: [769, 563], time: 70462.8 },
    //   { pos: [16, 558], time: 71774 },
    //   { pos: [606, 192], time: 72802.8 },
    //   { pos: [845, 4], time: 73440.4 },
    //   { pos: [638, 584], time: 73763.6 },
    //   { pos: [382, 27], time: 74379.2 },
    //   { pos: [167, 555], time: 75462 },
    //   { pos: [738, 500], time: 76048.8 },
    //   { pos: [548, 115], time: 76379.6 },
    //   { pos: [300, 546], time: 77091.6 },
    //   { pos: [586, 503], time: 78124 },
    //   { pos: [429, 121], time: 79445.6 },
    //   { pos: [108, 421], time: 79779.6 },
    //   { pos: [302, 348], time: 80812.4 },
    //   { pos: [109, 550], time: 81361.2 },
    //   { pos: [300, 191], time: 81785.2 },
    //   { pos: [821, 545], time: 82127.6 },
    //   { pos: [978, 175], time: 82480.8 },
    //   { pos: [78, 305], time: 83614 },
    //   { pos: [651, 264], time: 84380.4 },
    //   { pos: [491, 192], time: 85092 },
    //   { pos: [883, 500], time: 86468.8 },
    //   { pos: [196, 600], time: 89128.8 },
    //   { pos: [909, 115], time: 91132.4 },
    //   { pos: [384, 259], time: 91389.6 },
    //   { pos: [689, 170], time: 91966.8 },
    //   { pos: [633, 400], time: 93168 },
    //   { pos: [692, 563], time: 93647.6 },
    //   { pos: [673, 29], time: 93808.8 },
    //   { pos: [556, 151], time: 94134.8 },
    //   { pos: [350, 75], time: 95464.8 },
    //   { pos: [18, 326], time: 96124.4 },
    //   { pos: [864, 48], time: 96788 },
    //   { pos: [877, 172], time: 97216.4 },
    //   { pos: [901, 553], time: 97739.2 },
    //   { pos: [482, 581], time: 98138.8 },
    //   { pos: [840, 278], time: 99486.8 },
    //   { pos: [734, 441], time: 99909.6 },
    //   { pos: [794, 61], time: 100413.2 },
    //   { pos: [348, 39], time: 100788 },
    //   { pos: [107, 157], time: 101458.8 },
    //   { pos: [355, 385], time: 102143.2 },
    //   { pos: [671, 269], time: 103471.2 },
    //   { pos: [170, 353], time: 104124.4 },
    //   { pos: [876, 15], time: 104762 },
    //   { pos: [606, 492], time: 106126.4 },
    //   { pos: [143, 156], time: 106779.6 },
    //   { pos: [248, 476], time: 107454.8 },
    //   { pos: [583, 307], time: 108805.2 },
    //   { pos: [162, 273], time: 109467.2 },
    //   { pos: [368, 145], time: 110129.2 },
    //   { pos: [283, 291], time: 111454.8 },
    //   { pos: [992, 227], time: 112370.8 },
    //   { pos: [770, 22], time: 112685.6 },
    //   { pos: [114, 64], time: 113503.2 },
    //   { pos: [518, 169], time: 115132.4 },
    //   { pos: [947, 473], time: 117784.8 },
    //   { pos: [319, 135], time: 120480.4 },
    //   { pos: [634, 341], time: 122764 },
    //   { pos: [184, 380], time: 123342.4 },
    //   { pos: [760, 569], time: 123789.6 },
    //   { pos: [127, 239], time: 124071.6 },
    //   { pos: [860, 56], time: 125131.6 },
    //   { pos: [416, 131], time: 126082.8 },
    //   { pos: [399, 483], time: 126812.4 },
    //   { pos: [219, 535], time: 127040.8 },
    //   { pos: [663, 283], time: 127747.2 },
    //   { pos: [495, 387], time: 128787.6 },
    //   { pos: [750, 270], time: 129063.6 },
    //   { pos: [934, 86], time: 129454.8 },
    //   { pos: [410, 571], time: 129729.6 },
    //   { pos: [554, 491], time: 130482 },
    //   { pos: [614, 491], time: 131464 },
    //   { pos: [766, 99], time: 131786.8 },
    //   { pos: [774, 445], time: 132030.8 },
    //   { pos: [262, 570], time: 132730 },
    //   { pos: [71, 40], time: 134129.6 },
    //   { pos: [454, 533], time: 134280 },
    //   { pos: [840, 587], time: 134739.2 },
    //   { pos: [933, 568], time: 135787.6 },
    //   { pos: [562, 479], time: 137379.2 },
    //   { pos: [376, 504], time: 137840 },
    //   { pos: [221, 306], time: 138408.8 },
    //   { pos: [732, 346], time: 138722.4 },
    //   { pos: [961, 335], time: 139457.2 },
    //   { pos: [639, 268], time: 139800.4 },
    //   { pos: [703, 70], time: 140136.4 },
    //   { pos: [481, 230], time: 140507.6 },
    //   { pos: [803, 47], time: 141177.6 },
    //   { pos: [556, 50], time: 141462 },
    //   { pos: [776, 518], time: 142140.8 },
    //   { pos: [94, 234], time: 142450 },
    //   { pos: [954, 76], time: 145101.6 },
    //   { pos: [760, 205], time: 145652 },
    //   { pos: [949, 16], time: 146457.2 },
    //   { pos: [678, 410], time: 147142.8 },
    //   { pos: [247, 417], time: 147760 },
    //   { pos: [636, 53], time: 148544.8 },
    // ];
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
