const Game = require("./game");
const GameView = require("./game_view");
const Beatmap1 = require("./assets/beatmaps/beatmap1")
const Beatmap2 = require("./assets/beatmaps/beatmap2")
const Beatmap3 = require("./assets/beatmaps/beatmap3")
const Beatmap4 = require("./assets/beatmaps/beatmap4")
const Beatmap5 = require("./assets/beatmaps/beatmap5")
const Beatmap6 = require("./assets/beatmaps/beatmap6")
const Beatmap7 = require("./assets/beatmaps/beatmap7")
const Beatmap8 = require("./assets/beatmaps/beatmap8")
const Beatmap9 = require("./assets/beatmaps/beatmap9")
const Beatmap10 = require("./assets/beatmaps/beatmap10")

document.addEventListener("DOMContentLoaded", function () {
  const startMenu = document.querySelector(".start-menu");
  const startButton = document.getElementById("start-btn");
  const songsButton = document.getElementById("songs-btn");
  const instructButton = document.getElementById("instructions-btn");
  const volumeButtonStart = document.getElementById("volume-btn-start");
  const volumeInputStart = document.getElementById("volume-start");
  const muteButtonStart = document.querySelector(".mute")
  
  const songsMenu = document.querySelector(".songs-menu");
  const startMenuButton = document.getElementById("start-menu-btn");
  const volumeButtonSongs = document.getElementById("volume-btn-songs");
  const volumeInputSongs = document.getElementById("volume-songs");
  const muteButtonSongs = document.getElementById("mute-songs")

  const volumeButtonGame = document.getElementById("volume-btn-GV");
  const volumeInputGame = document.getElementById("volume-GV");
  const muteButtonGame = document.getElementById("mute-GV")
  const gameContainer = document.querySelector(".game");
  const canvasElement = document.getElementById("game-canvas");
  const ctx = canvasElement.getContext("2d");
  window.ctx = ctx;

  anime({
    targets: ".start-option",
    width: "100%",
    easing: "easeInOutQuad",
    direction: "normal",
    delay: anime.stagger(500)
  });

  // anime({
  //   targets:".title",
  //   scale: 1.02,
  //   direction: "alternate",
  //   easing: 'easeInOutSine',
  //   loop: true,
  // })

  //volume
  let volumeLvl=50;
  let mute = false;

  volumeButtonStart.addEventListener("click", () => {
    console.log("in volume event")
    if(volumeInputStart.className === "hidden"){
      volumeInputStart.classList.remove("hidden")
      muteButtonStart.classList.remove("hidden")
    }
    else{
      volumeInputStart.classList.add("hidden")
      muteButtonStart.classList.add("hidden")
    }
  });

  muteButtonStart.addEventListener("click", ()=> {
    if(!mute){
      mute = true;
      volumeInputStart.value = 0;
      volumeInputSongs.value = 0;
      volumeInputGame.value = 0;
    }
    else{
      mute = false;
      volumeInputStart.value = volumeLvl
      volumeInputSongs.value = volumeLvl
      volumeInputGame.value = volumeLvl
    }
  })

  volumeInputStart.addEventListener("change", (e) => {
    volumeLvl = e.target.value;
    volumeInputSongs.value = volumeLvl;
  });

  volumeButtonSongs.addEventListener("click", () => {
    if(volumeInputSongs.className === "hidden"){
      volumeInputSongs.className = ""
      muteButtonSongs.classList.remove("hidden")
    }
    else{
      volumeInputSongs.className="hidden"
      muteButtonSongs.classList.add("hidden")
    }
  });

  muteButtonSongs.addEventListener("click", () => {
    if (!mute) {
      mute = true;
      volumeInputStart.value = 0;
      volumeInputSongs.value = 0;
      volumeInputGame.value = 0;
    }
    else {
      mute = false;
      volumeInputStart.value = volumeLvl
      volumeInputSongs.value = volumeLvl
      volumeInputGame.value = volumeLvl
    }
  })

  volumeInputSongs.addEventListener("change", (e) => {
    volumeLvl = e.target.value;
    volumeInputStart.value = volumeLvl;
    // volumeInputSongs.className = "hidden"
  });

  instructButton.addEventListener("click", () => {
    console.log("instructions");
  });
  
  //song selection
  songsButton.addEventListener("click", () => {
    startMenu.classList.add("hidden");
    songsMenu.classList.remove("hidden");
    gameContainer.classList.add("hidden");
    canvasElement.className = "song-choice-1";
    anime({
      targets: ".start-option",
      width: "0%",
      direction: "normal",
    });
  });
  // anime({
  //   targets: "#start-btn",
  //   scale: 1.1,
  //   direction: "alternate",
  //   easing: 'easeInOutSine',
  //   loop: true,
  // })

  // const delay = 3000; //ms

  const songs = document.querySelector(".song-options");
  const songCount = songs.childElementCount;
  const maxLeft = (songCount - 1) * 100 * -1;

  let current = 0;
  let audioURL = "./src/assets/sounds/1. Cut Your Teeth by Kyla La Grange (Kygo Remix).mp3";
  let beatmap = Beatmap1;
  function changeSong(next = true) {
    if (next) {
      current += current > maxLeft ? -100 : current * -1;
    } else {
      current = current < 0 ? current + 100 : maxLeft;
    }

    songs.style.left = current + "%";
    if(current === 0) {
      canvasElement.className = "song-choice-1";
      beatmap = Beatmap1;
      audioURL =
        "./src/assets/sounds/1. Cut Your Teeth by Kyla La Grange (Kygo Remix).mp3";
    }
    else if(current === -100){
      canvasElement.className = "song-choice-2";
      beatmap = Beatmap2;
      audioURL =
        "./src/assets/sounds/2. トルコ行進曲 by T.M. Orchestra.mp3";
    }
    else if(current === -200){
      canvasElement.className = "song-choice-3";
      beatmap = Beatmap3;
      audioURL =
        "./src/assets/sounds/3. さよならトリップ by Dormir.mp3";
    }
    else if(current === -300){
      canvasElement.className = "song-choice-4";
      beatmap = Beatmap4;
      audioURL =
        "./src/assets/sounds/4. Mario Brothers Theme.mp3";
    }
    else if(current === -400){
      canvasElement.className = "song-choice-5";
      beatmap = Beatmap5;
      audioURL =
        "./src/assets/sounds/5. Theory of Eternity by TAG.mp3";
    }
    else if(current === -500){
      canvasElement.className = "song-choice-6";
      beatmap = Beatmap6;
      audioURL =
        "./src/assets/sounds/6. Don't Give Up On Me Now by R3HAB and Julie Bergan.mp3";
    }
    else if(current === -600){
      canvasElement.className = "song-choice-7";
      beatmap = Beatmap7;
      audioURL =
        "./src/assets/sounds/7. もののけ姫 by 新井大樹.mp3";
    }
    else if(current === -700){
      canvasElement.className = "song-choice-8";
      beatmap = Beatmap8;
      audioURL =
        "./src/assets/sounds/8. Polygon by Sota Fujimori.mp3";
    }
    else if(current === -800){
      canvasElement.className = "song-choice-9";
      beatmap = Beatmap9;
      audioURL =
        "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
    }
    else if(current === -900){
      canvasElement.className = "song-choice-10";
      beatmap = Beatmap10;
      audioURL =
        "./src/assets/sounds/10. Country Rounds by Kings & Folks (Sqeepo Remix) .mp3";
    }
  }

  // let autoChange = setInterval(changeSong, delay);
  // const restart = function () {
  //   clearInterval(autoChange);
  //   autoChange = setInterval(changeSong, delay);
  // };

  const nextSongButton = document.getElementById("next-btn")
  nextSongButton.addEventListener("click", () => {
    changeSong();
    // restart();
  });

  const prevSongButton = document.getElementById("prev-btn")
  prevSongButton.addEventListener("click", () => {
    changeSong(false);
    // restart();
  });

  startMenuButton.addEventListener("click", () => {
    startMenu.classList.remove("hidden");
    songsMenu.classList.add("hidden");
    gameContainer.classList.add("hidden");
    anime({
      targets: ".start-option",
      width: "100%",
      easing: "easeInOutQuad",
      direction: "normal",
      delay: anime.stagger(1000)
    });
  });

  //set game area
  canvasElement.width = window.innerWidth;
  canvasElement.height = window.innerHeight;

  //start new game
  startButton.addEventListener("click", () => {
    startMenu.classList.add("hidden");
    songsMenu.classList.add("hidden");
    gameContainer.classList.remove("hidden");
    const game = new Game(beatmap);
    let gv_options = {
      audioURL: audioURL,
      volume: volumeLvl,
      mute: mute,
    };
    const gameview = new GameView(game, ctx, gv_options).start();
  });
});
