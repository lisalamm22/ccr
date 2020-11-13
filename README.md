# Click Click Revolution

[Play CCR!](https://lisalamm22.github.io/ccr/)

CCR is a rhythm game that requires precise mouse movements and keypress timing. Integrates object-oriented Javascript game structure with smooth rendering of HTML5 canvas and HTML5 audio elements to foster an immersive and upbeat game environment.
![CCR](https://user-images.githubusercontent.com/68566126/98774000-f0ff4c00-239e-11eb-9a36-0fe05efcc900.png)

## Gameplay
Players will receive visual circular prompts that indicate where to aim the cursor and when to press. These prompts correspond with the beats of the audio and timing of the keypress is essential to scoring high.

## Implementation
### Game Rendering
A ```GameView ``` class renders the game, using a ```requestAnimationFrame ``` loop to maintain a constant 60fps refresh rate. 
The ```GameView``` keeps track of all game objects including the ```Beat```, audio element, and player position/activity.
The ```GameView``` is responsible for checking the success of a players click/keypress for beats that are active.
```js
//iterate through beatmap to find activebeats and draw on canvas
this.game.redraw(this.ctx);
if (this.game.beats.length !== 0) {
    this.game.beats.forEach((beat, idx) => {
        this.isActiveBeat(beat, idx, this.lastTime)
        if(beat.type === "CLICK"){
            this.drawBeat(beat, this.lastTime)
        }
        else{
            this.drawDrag(beat, this.lastTime)
            if(beat.held){
                this.checkDrag(beat, this.lastTime)
            }
        }
    })
}
if (this.restart){
    return null
} else if(this.pause){
    return null
} else{
    requestAnimationFrame(this.animate.bind(this));
}
```

### Beatmaps
The game canvas sizes itself dynamically based on ```window.innerWidth``` and ```window.innerHeight```. To ensure beatmaps display at scale, positions for each beat are scalar values rather than absolute values:
```js
const Beatmap = [
    { pos: [0.5, 0.5], time: 2410},
    { pos: [0.44, 0.44], time: 3000},
    { pos: [0.38, 0.5], time: 3630},
    { pos: [0.44, 0.44], time: 4200},
    { pos: [0.38, 0.5], time: 4790},
]
```

### Displaying Beats
The ```GameView``` delegates rendering and passes on the proper parameters to the ```Beat```. 
Since timing is crucial, dynamic rings guide the player to the optimal timing to hit a ```Beat```. 
Once a ```Beat``` is hit in the proper active time, the player receives visual feedback indicating a success. 
```js
// check what stage of display Beat is in and draw based on current time
const timeDelta =  time - beat.time;
const beatTime = 1000
const activeBeatT = 500
const inactiveBeatT = beatTime - activeBeatT
if (Math.abs(timeDelta) <= beatTime) {    
    if(Object.keys(this.hitBeats).includes(JSON.stringify(beat))){
        let hitTime = this.hitBeats[JSON.stringify(beat)]
        this.drawHitBeat(this.ctx, beat, hitTime, time)
    }
    else if(timeDelta < -activeBeatT){
        let radiusMul = (-(timeDelta+ inactiveBeatT)/ inactiveBeatT) + 2;
        let opacity = (1+((timeDelta + inactiveBeatT) / inactiveBeatT));
        beat.drawClick(this.ctx, opacity);
        beat.drawRing(this.ctx, opacity, radiusMul, "white")
    }
}
```
     

## Future Improvements
### More Shapes
New shapes of beats besides a static click or drag would add more variety and difficulty to beatmaps. 

### Automating Beatmap Generation
Creating beatmaps manually is time consuming and not very precise. Adding automation would increase the quality of each beatmap.
Increased efficiency would also allow for ease of creating new beatmaps and therefore increasing the selection of playable levels.
