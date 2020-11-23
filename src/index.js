const Game = require("./game");
const GameView = require("./game_view");
const Beatmap1 = require("./assets/beatmaps/beatmap3")
const Beatmap2 = require("./assets/beatmaps/beatmap9")
const Beatmap3 = require("./assets/beatmaps/beatmap1")
const Beatmap4 = require("./assets/beatmaps/beatmap4")
const Beatmap5 = require("./assets/beatmaps/beatmap5")
const Beatmap6 = require("./assets/beatmaps/beatmap6")
const Beatmap7 = require("./assets/beatmaps/beatmap7")
const Beatmap8 = require("./assets/beatmaps/beatmap8")
const Beatmap9 = require("./assets/beatmaps/beatmap2")
const Beatmap10 = require("./assets/beatmaps/beatmap10")

document.addEventListener("DOMContentLoaded", function () {
  const startMenu = document.querySelector(".start-menu");
  const startButton = document.getElementById("start-btn");
  const songsButton = document.getElementById("songs-btn");
  const instructButton = document.getElementById("instructions-btn");
  const instructions = document.getElementById("instructions");
  const instructionsDoneButton = document.getElementById("instruct-done-btn");
  const volumeButtonStart = document.getElementById("volume-btn-start");
  const volumeInputStart = document.getElementById("volume-start");
  const muteButtonStart = document.querySelector(".mute");

  const songsMenu = document.querySelector(".songs-menu");
  const startMenuButton = document.getElementById("start-menu-btn");
  const volumeButtonSongs = document.getElementById("volume-btn-songs");
  const volumeInputSongs = document.getElementById("volume-songs");
  const muteButtonSongs = document.getElementById("mute-songs");

  const volumeInputGame = document.getElementById("volume-GV");
  const exitGameButton = document.getElementById("exit-game-btn");

  const gameContainer = document.querySelector(".game");
  const canvasElement = document.getElementById("game-canvas");
  const ctx = canvasElement.getContext("2d");
  window.ctx = ctx;

  anime({
    targets: ".start-option",
    width: "100%",
    easing: "easeInOutQuad",
    direction: "normal",
    delay: anime.stagger(500),
  });

  anime({
    targets:".title",
    scale: 1.02,
    direction: "alternate",
    easing: 'easeInOutSine',
    loop: true,
  })

  //volume
  let volumeLvl = 50;
  let mute = false;

  volumeButtonStart.addEventListener("click", () => {
    if (volumeInputStart.className === "hidden") {
      volumeInputStart.classList.remove("hidden");
      muteButtonStart.classList.remove("hidden");
    } else {
      volumeInputStart.classList.add("hidden");
      muteButtonStart.classList.add("hidden");
    }
  });

  muteButtonStart.addEventListener("click", () => {
    if (!mute) {
      mute = true;
      volumeInputStart.value = 0;
      volumeInputSongs.value = 0;
      volumeInputGame.value = 0;
      audioSnip.volume = 0;
    } else {
      mute = false;
      volumeInputStart.value = volumeLvl;
      volumeInputSongs.value = volumeLvl;
      volumeInputGame.value = volumeLvl;
      audioSnip.volume = volumeLvl / 100;
    }
  });

  volumeInputStart.addEventListener("change", (e) => {
    volumeLvl = e.target.value;
    volumeInputSongs.value = volumeLvl;
    volumeInputGame.value = volumeLvl;
    audioSnip.volume = volumeLvl / 100;
  });

  volumeButtonSongs.addEventListener("click", () => {
    if (volumeInputSongs.className === "hidden") {
      volumeInputSongs.className = "";
      muteButtonSongs.classList.remove("hidden");
    } else {
      volumeInputSongs.className = "hidden";
      muteButtonSongs.classList.add("hidden");
    }
  });

  muteButtonSongs.addEventListener("click", () => {
    if (!mute) {
      mute = true;
      volumeInputStart.value = 0;
      volumeInputSongs.value = 0;
      volumeInputGame.value = 0;
      audioSnip.volume = 0;
    } else {
      mute = false;
      volumeInputStart.value = volumeLvl;
      volumeInputSongs.value = volumeLvl;
      volumeInputGame.value = volumeLvl;
      audioSnip.volume = volumeLvl / 100;
    }
  });

  volumeInputSongs.addEventListener("change", (e) => {
    volumeLvl = e.target.value;
    volumeInputStart.value = volumeLvl;
    volumeInputGame.value = volumeLvl;
    audioSnip.volume = volumeLvl / 100;
  });

  instructButton.addEventListener("click", () => {
    instructions.classList.remove("hidden");
    instructionsDoneButton.classList.remove("hidden");
  });

  instructionsDoneButton.addEventListener("click", () => {
    instructions.classList.add("hidden");
    instructionsDoneButton.classList.add("hidden");
  });

  anime({
    targets: "#start-btn",
    scale: 1.1,
    direction: "alternate",
    easing: 'easeInOutSine',
    loop: true,
  })

  //song selection
  const songs = document.querySelector(".song-options");
  const songCount = songs.childElementCount;
  const maxLeft = (songCount - 1) * 100 * -1;

  let current = 0;
  let songchoice = 1;
  let audioURL =
    "./src/assets/sounds/3. さよならトリップ by Dormir.mp3";;
  let beatmap = Beatmap1;
  let audioSnip = new Audio(audioURL);
  audioSnip.volume = volumeLvl / 100;

  songsButton.addEventListener("click", () => {
    startMenu.classList.add("hidden");
    songsMenu.classList.remove("hidden");
    gameContainer.classList.add("hidden");
    canvasElement.className = "song-choice-1";
    audioSnip.currentTime = 0;
    audioSnip.play();
    replayAudioSnip();
    anime({
      targets: ".start-option",
      width: "0%",
      direction: "normal",
    });
  });

  function replayAudioSnip() {
    setTimeout(function () {
      audioSnip.currentTime = 0;
      replayAudioSnip();
    }, 30000);
  }

  function changeSong(next = true) {
    if (next) {
      current += current > maxLeft ? -100 : current * -1;
    } else {
      current = current < 0 ? current + 100 : maxLeft;
    }

    songs.style.left = current + "%";
    checkCurrent(current);
    audioSnip.pause();
    audioSnip.setAttribute("src", audioURL);
    audioSnip.load();
    audioSnip.currentTime = 0;
    audioSnip.play();
  }

  function checkCurrent(current) {
    if (current === 0) {
      canvasElement.className = "song-choice-1";
      beatmap = Beatmap1;
      songchoice = 1;
      audioURL = "./src/assets/sounds/3. さよならトリップ by Dormir.mp3";
    } else if (current === -100) {
      canvasElement.className = "song-choice-2";
      beatmap = Beatmap2;
      songchoice = 2;
      audioURL =
      "./src/assets/sounds/9. Sunflower by Swae Lee and Post Malone.mp3";
    } else if (current === -200) {
      canvasElement.className = "song-choice-3";
      beatmap = Beatmap3;
      songchoice = 3;
      audioURL =
      "./src/assets/sounds/1. Cut Your Teeth by Kyla La Grange (Kygo Remix).mp3";
    } else if (current === -300) {
      canvasElement.className = "song-choice-4";
      beatmap = Beatmap4;
      songchoice = 4;
      audioURL = "./src/assets/sounds/4. Mario Brothers Theme.mp3";
    } else if (current === -400) {
      canvasElement.className = "song-choice-5";
      beatmap = Beatmap5;
      songchoice = 5;
      audioURL = "./src/assets/sounds/5. Theory of Eternity by TAG.mp3";
    } else if (current === -500) {
      canvasElement.className = "song-choice-6";
      beatmap = Beatmap6;
      songchoice = 6;
      audioURL =
      "./src/assets/sounds/6. Don't Give Up On Me Now by R3HAB and Julie Bergan.mp3";
    } else if (current === -600) {
      canvasElement.className = "song-choice-7";
      beatmap = Beatmap7;
      songchoice = 7;
      audioURL = "./src/assets/sounds/7. もののけ姫 by 新井大樹.mp3";
    } else if (current === -700) {
      canvasElement.className = "song-choice-8";
      beatmap = Beatmap8;
      songchoice = 8;
      audioURL = "./src/assets/sounds/8. Polygon by Sota Fujimori.mp3";
    } else if (current === -800) {
      canvasElement.className = "song-choice-9";
      beatmap = Beatmap9;
      songchoice = 9;
      audioURL = "./src/assets/sounds/2. トルコ行進曲 by T.M. Orchestra.mp3";
    } else if (current === -900) {
      canvasElement.className = "song-choice-10";
      beatmap = Beatmap10;
      songchoice = 10;
      audioURL =
        "./src/assets/sounds/10. Country Rounds by Kings & Folks (Sqeepo Remix) .mp3";
    }
  }

  const nextSongButton = document.getElementById("next-btn");
  nextSongButton.addEventListener("click", () => {
    changeSong();
  });

  const prevSongButton = document.getElementById("prev-btn");
  prevSongButton.addEventListener("click", () => {
    changeSong(false);
  });

  startMenuButton.addEventListener("click", () => {
    startMenu.classList.remove("hidden");
    songsMenu.classList.add("hidden");
    gameContainer.classList.add("hidden");
    audioSnip.pause();
    anime({
      targets: ".start-option",
      width: "100%",
      easing: "easeInOutQuad",
      direction: "normal",
      delay: anime.stagger(500),
    });
  });

  canvasElement.width = window.innerWidth;
  canvasElement.height = window.innerHeight;

  //start new game
  let audioObj = new Audio(audioURL);
  let gameview = {};
  startButton.addEventListener("click", () => {
    startMenu.classList.add("hidden");
    songsMenu.classList.add("hidden");
    gameContainer.classList.remove("hidden");
    checkCurrent(current);
    const game = new Game(beatmap);
    audioSnip.pause();
    audioObj.setAttribute("src", audioURL);
    audioObj.load();
    let gv_options = {
      audioObj: audioObj,
      volume: volumeLvl,
      mute: mute,
    };
    if (gameview[songchoice]) {
      gameview[songchoice].restartGame();
    } else {
      gameview[songchoice] = new GameView(game, ctx, gv_options);
      gameview[songchoice].start();
    }
  });

  exitGameButton.addEventListener("click", () => {
    volumeLvl = audioObj.volume * 100;
    audioObj.pause();
    startMenu.classList.remove("hidden");
    songsMenu.classList.add("hidden");
    gameContainer.classList.add("hidden");
    anime({
      targets: ".start-option",
      width: "100%",
      easing: "easeInOutQuad",
      direction: "normal",
      delay: anime.stagger(500),
    });
  });

  const finalScore = document.querySelector(".final-score-board");
  const scoreDoneButton = document.getElementById("score-done-btn")
  scoreDoneButton.addEventListener("click", () => {
    finalScore.classList.add("hidden")
    startMenu.classList.add("hidden");
    songsMenu.classList.remove("hidden");
    gameContainer.classList.add("hidden");
    audioSnip.currentTime = 0;
    audioSnip.play();
    replayAudioSnip();
  })
});
