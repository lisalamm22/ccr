const Game = require("./game");
const GameView = require("./game_view");

document.addEventListener("DOMContentLoaded", function () {
  const startMenu = document.querySelector(".start-menu");
  const startButton = document.getElementById("start-btn");
  const songsButton = document.getElementById("songs-btn");
  const instructButton = document.getElementById("instructions-btn");
  const volumeButton = document.getElementById("volume-btn");
  const volumeInputStart = document.getElementById("volume-start");

  const songsMenu = document.querySelector(".songs-menu");
  const startMenuButton = document.getElementById("start-menu-btn");
  const volumeInputSongs = document.getElementById("volume-songs");

  const gameContainer = document.querySelector(".game");
  const canvasElement = document.getElementById("game-canvas");
  const ctx = canvasElement.getContext("2d");
  window.ctx = ctx;

  anime({
    targets: ".start-option",
    width: "100%",
    easing: "easeInOutQuad",
    direction: "normal",
    delay: anime.stagger(1000)
  });

  anime({
    targets:".title",
    scale: 1.02,
    direction: "alternate",
    easing: 'easeInOutSine',
    loop: true,
  })

  //volume
  let volumeLvl;

  volumeButton.addEventListener("click", () => {
    console.log("volume-pop-up");
  });

  volumeInputStart.addEventListener("change", (e) => {
    volumeLvl = e.target.value;
    volumeInputSongs.value = volumeLvl;
  });

  volumeInputSongs.addEventListener("change", (e) => {
    volumeLvl = e.target.value;
    volumeInputStart.value = volumeLvl;
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
    // startButton.disabled = true;
  });
  anime({
    targets: "#start-btn",
    scale: 1.1,
    direction: "alternate",
    easing: 'easeInOutSine',
    loop: true,
  })

  // const delay = 3000; //ms

  const songs = document.querySelector(".song-options");
  const songCount = songs.childElementCount;
  const maxLeft = (songCount - 1) * 100 * -1;

  let current = 0;
  let audioURL = "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";;
  function changeSong(next = true) {
    if (next) {
      current += current > maxLeft ? -100 : current * -1;
    } else {
      current = current < 0 ? current + 100 : maxLeft;
    }

    songs.style.left = current + "%";
    if(current === 0) {
      canvasElement.className = "song-choice-1";
      audioURL =
        "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
    }
    else if(current === -100){
      canvasElement.className = "song-choice-2";
      audioURL =
        "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
    }
    else if(current === -200){
      canvasElement.className = "song-choice-3";
      audioURL =
        "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
    }
    else if(current === -300){
      canvasElement.className = "song-choice-4";
      audioURL =
        "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
    }
    else if(current === -400){
      canvasElement.className = "song-choice-5";
      audioURL =
        "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
    }
    else if(current === -500){
      canvasElement.className = "song-choice-6";
      audioURL =
        "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
    }
    else if(current === -600){
      canvasElement.className = "song-choice-7";
      audioURL =
        "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
    }
    else if(current === -700){
      canvasElement.className = "song-choice-8";
      audioURL =
        "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
    }
    else if(current === -800){
      canvasElement.className = "song-choice-9";
      audioURL =
        "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
    }
    else if(current === -900){
      canvasElement.className = "song-choice-10";
      audioURL =
        "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
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

  

  const song1 = document.getElementById("song1");
  song1.addEventListener("click", () => {
    canvasElement.className = "song-choice-1";
    // startButton.disabled = false;
    audioURL =
      "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
    console.log("1");
  });
  const song2 = document.getElementById("song2");
  song2.addEventListener("click", () => {
    canvasElement.className = "song-choice-2";
    // startButton.disabled = false;
    audioURL =
      "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
    console.log("2");
  });
  const song3 = document.getElementById("song3");
  song3.addEventListener("click", () => {
    canvasElement.className = "song-choice-3";
    // startButton.disabled = false;
    audioURL =
      "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
    console.log("3");
  });
  const song4 = document.getElementById("song4");
  song4.addEventListener("click", () => {
    canvasElement.className = "song-choice-4";
    // startButton.disabled = false;
    audioURL =
      "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
    console.log("4");
  });
  const song5 = document.getElementById("song5");
  song5.addEventListener("click", () => {
    canvasElement.className = "song-choice-5";
    // startButton.disabled = false;
    audioURL =
      "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
    console.log("5");
  });
  const song6 = document.getElementById("song6");
  song6.addEventListener("click", () => {
    canvasElement.className = "song-choice-6";
    // startButton.disabled = false;
    audioURL =
      "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
    console.log("6");
  });
  const song7 = document.getElementById("song7");
  song7.addEventListener("click", () => {
    canvasElement.className = "song-choice-7";
    // startButton.disabled = false;
    audioURL =
      "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
    console.log("7");
  });
  const song8 = document.getElementById("song8");
  song8.addEventListener("click", () => {
    canvasElement.className = "song-choice-8";
    // startButton.disabled = false;
    audioURL =
      "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
    console.log("8");
  });
  const song9 = document.getElementById("song9");
  song9.addEventListener("click", () => {
    canvasElement.className = "song-choice-9";
    // startButton.disabled = false;
    audioURL =
      "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
    console.log("9");
  });
  const song10 = document.getElementById("song10");
  song10.addEventListener("click", () => {
    canvasElement.className = "song-choice-10";
    // startButton.disabled = false;
    audioURL =
      "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
    console.log("10");
  });

  startMenuButton.addEventListener("click", () => {
    startMenu.classList.remove("hidden");
    songsMenu.classList.add("hidden");
    gameContainer.classList.add("hidden");
  });

  //set game area
  canvasElement.width = window.innerWidth;
  canvasElement.height = window.innerHeight;

  //start new game
  startButton.addEventListener("click", () => {
    startMenu.classList.add("hidden");
    songsMenu.classList.add("hidden");
    gameContainer.classList.remove("hidden");
    const game = new Game();
    let options = {
      audioURL: audioURL,
      volume: volumeLvl,
    };
    const gameview = new GameView(game, ctx, options).start();
  });
});
