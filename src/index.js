const Game = require("./game");
const GameView = require("./game_view");
const Beat = require("./beat")

// window.Beat = Beat;
// window.Game = Game;

document.addEventListener("DOMContentLoaded", function () {
    const startMenu = document.querySelector(".start-menu")
    const startButton = document.getElementById("start-btn");
    const songsButton = document.getElementById("songs-btn");
    const instructButton = document.getElementById("instructions-btn");
    const volumeButton = document.getElementById("volume-btn");

    const songsMenu = document.querySelector(".songs-menu")
    const startMenuButton = document.getElementById("start-menu-btn")

    const gameContainer = document.querySelector(".game")
    const canvasElement = document.getElementById("game-canvas");
    const ctx = canvasElement.getContext("2d");
    window.ctx = ctx;

    //set game area
    canvasElement.width = window.innerWidth;
    canvasElement.height = window.innerHeight;

    songsButton.addEventListener("click", () => {
      startMenu.classList.add('hidden')
      songsMenu.classList.remove('hidden')
      gameContainer.classList.add('hidden')
    })

    let audioURL;
    let imageURL;

    const song1 = document.getElementById("song1")
    song1.addEventListener("click", ()=> {
      canvasElement.className = "song-choice-1"
      audioURL = "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3"
      // imageURL = "./src/assets/images/1.jpg";
      console.log("1")
    })
    const song2 = document.getElementById("song2")
    song2.addEventListener("click", ()=> {
      canvasElement.className = "song-choice-2";
      audioURL = "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3"
      // imageURL = "./src/assets/images/2.jpg";
      console.log("2")
    })
    const song3 = document.getElementById("song3")
    song3.addEventListener("click", ()=> {
      canvasElement.className = "song-choice-3";
      audioURL = "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3"
      // imageURL = "./src/assets/images/3.jpg";
      console.log("3");
    })
    const song4 = document.getElementById("song4")
    song4.addEventListener("click", ()=> {
      canvasElement.className = "song-choice-4";
      audioURL = "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3"
      // imageURL = "./src/assets/images/4.jpg";
      console.log("4");
    })
    const song5 = document.getElementById("song5")
    song5.addEventListener("click", ()=> {
      canvasElement.className = "song-choice-5";
      audioURL = "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3"
      // imageURL = "./src/assets/images/5.jpg";
      console.log("5");
    })
    const song6 = document.getElementById("song6")
    song6.addEventListener("click", ()=> {
      canvasElement.className = "song-choice-6";
      audioURL = "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3"
      // imageURL = "./src/assets/images/6.jpg";
      console.log("6");
    })

    startMenuButton.addEventListener("click", () => {
      startMenu.classList.remove('hidden')
      songsMenu.classList.add('hidden')
      gameContainer.classList.add('hidden')
    })

    //start new game
    startButton.addEventListener("click", ()=>{
      startMenu.classList.add('hidden');
      songsMenu.classList.add('hidden');
      gameContainer.classList.remove('hidden');
      console.log(audioURL)
      console.log(imageURL)
      // let options = {
      //   imageURL: imageURL
      // }
      const game = new Game();
      const gameview = new GameView(game, ctx, audioURL).start();
    })
});
