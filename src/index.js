const Game = require("./game");
const GameView = require("./game_view");
const Beat = require("./beat")

// window.Beat = Beat;
// window.Game = Game;

document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("start-btn");
    const canvasElement = document.getElementById("game-canvas");
    const ctx = canvasElement.getContext("2d");
    window.ctx = ctx;

    //set game area
    canvasElement.width = Game.DIM_X;
    canvasElement.height = Game.DIM_Y;

    //start new game
    startButton.addEventListener("click", ()=>{
        const game = new Game();
        const audioURL =
          "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
        const gameview = new GameView(game, ctx).start(audioURL);
    })
});
