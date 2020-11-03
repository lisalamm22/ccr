const Game = require("./game");
const GameView = require("./game_view");
const Beat = require("./beat")

// window.Beat = Beat;
// window.Game = Game;

document.addEventListener("DOMContentLoaded", function () {
    const canvasElement = document.getElementById("game-canvas");
    const ctx = canvasElement.getContext("2d");
    window.ctx = ctx;

    //set game area
    canvasElement.width = Game.DIM_X;
    canvasElement.height = Game.DIM_Y;

    //get mouse coordinates

    //start new game
    const game = new Game();
    new GameView(game, ctx).start();
});
