/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/beat.js":
/*!*********************!*\
  !*** ./src/beat.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("\nconst DEFAULTS = {\n  TYPE: \"PRESS\",\n  SHAPE: \"DOT\",\n  SEQ: \"\",\n  ACTIVE: false,\n  COLOR: \"blue\",\n  RADIUS: 10,\n};\n\nfunction Beat(options){\n    this.pos = options.pos;\n    this.time = options.time;\n    this.type = options.type || DEFAULTS.TYPE;\n    this.shape = options.shape || DEFAULTS.SHAPE;\n    this.seq = options.seq || DEFAULTS.SEQ;\n    this.active = options.active || DEFAULTS.ACTIVE;\n    this.color = options.color || DEFAULTS.COLOR;\n    this.radius = options.radius || DEFAULTS.RADIUS;\n}\n\nBeat.prototype.draw = function draw(ctx) {\n  ctx.fillStyle = this.color;\n\n  ctx.beginPath();\n  ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true);\n  ctx.fill();\n};\n\nmodule.exports = Beat;\n\n//# sourceURL=webpack:///./src/beat.js?");

/***/ }),

/***/ "./src/game.js":
/*!*********************!*\
  !*** ./src/game.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const Beat = __webpack_require__(/*! ./beat */ \"./src/beat.js\");\n\nGame.BG_COLOR = \"#000000\";\nGame.DIM_X = 1000;\nGame.DIM_Y = 600;\nGame.FPS = 30;\n// Game.NUM_ASTEROIDS = 10;\n\nfunction Game(options) {\n    // this.beatmap = options.beatmap;\n    this.beatmap = [\n      {pos: [20, 20], time: 2000,},\n      {pos: [60, 40], time: 2500,},\n      {pos: [150, 200], time: 3000,},\n      {pos: [230, 300], time: 4000,},\n      {pos: [200, 290], time: 5000,},\n      {pos: [600, 400], time: 6000,},\n      {pos: [715, 200], time: 8000,},\n      {pos: [230, 300], time: 9000,},\n    ];\n    this.activeBeats = [];\n    this.currentTime = 0;\n}\n\nGame.prototype.draw = function draw(ctx) {\n  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);\n  ctx.fillStyle = Game.BG_COLOR;\n  ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);\n};\n\n// Game.prototype.displayBeat = function displayBeat(beat){\n    \n// }\n\nGame.prototype.makeBeats = function makeBeats(){\n    this.beats = this.beatmap.map(beat => {\n        return new Beat(beat)\n    })\n}\n\nmodule.exports = Game;\n\n\n//# sourceURL=webpack:///./src/game.js?");

/***/ }),

/***/ "./src/game_view.js":
/*!**************************!*\
  !*** ./src/game_view.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function GameView(game, ctx) {\n  this.ctx = ctx;\n  this.game = game;\n}\n\nGameView.prototype.start = function start() {\n  //   this.bindKeyHandlers();\n  this.game.makeBeats();\n  this.lastTime = 0;\n  this.beatIdx = 0;\n  requestAnimationFrame(this.animate.bind(this));\n};\n\nGameView.prototype.animate = function animate(time) {\n  const timeDelta = time - this.lastTime;\n\n  this.game.draw(this.ctx);\n  if (this.game.beats.length !== 0) {\n    this.game.beats.forEach((beat,idx) => {\n      if (Math.abs(beat.time - time) <= 1000) {\n        if(idx >= this.beatIdx){ //prevent duplicates in activeBeats\n            if(Math.abs(beat.time - time) <= 500) {\n                this.game.activeBeats.push(beat);\n                this.beatIdx++;\n            }\n        }\n        // this.game.activeBeats.forEach((activeBeat,idx2)=>{\n            //event listener for mouse click\n            //if click, and position within beat radius (if outside radius, ignore click), draw hit animation and remove from active beats\n                //draw scenario 1: draw hit. remove from activebeats\n            //if time difference exceeds 500, play miss animation and remove from active beats\n                //skip/optional: draw scenario 2: if miss, flash red and indicate miss. otherwise, beat would disappear on its own without any indicator\n        // }\n        //if you didn't encounter draw scenarios 1 or 2, then you do draw scenario 3 below:\n        //draw scenario 3: confirm still in active beats. draw as normal:\n        beat.draw(this.ctx); \n      }\n    });\n  }\n  console.log(this.game.activeBeats)\n  this.lastTime = time;\n  requestAnimationFrame(this.animate.bind(this));\n};\n\nmodule.exports = GameView;\n\n\n//# sourceURL=webpack:///./src/game_view.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const Game = __webpack_require__(/*! ./game */ \"./src/game.js\");\nconst GameView = __webpack_require__(/*! ./game_view */ \"./src/game_view.js\");\nconst Beat = __webpack_require__(/*! ./beat */ \"./src/beat.js\")\n\n// window.Beat = Beat;\n// window.Game = Game;\n\ndocument.addEventListener(\"DOMContentLoaded\", function () {\n    const canvasElement = document.getElementById(\"game-canvas\");\n    const ctx = canvasElement.getContext(\"2d\");\n    window.ctx = ctx;\n\n    //set game area\n    canvasElement.width = Game.DIM_X;\n    canvasElement.height = Game.DIM_Y;\n\n    //get mouse coordinates\n\n    //start new game\n    const game = new Game();\n    new GameView(game, ctx).start();\n});\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });