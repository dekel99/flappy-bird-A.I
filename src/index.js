import { NeuralNetwork } from "./nn/nn"
import { eventListeners } from './js/eventListeners'
import groundObj from "./js/objects/ground.js"
import backgroundObj from './js/objects/background'
import pipeObj from "./js/objects/pipe"
import birdObj from './js/objects/bird'
import UIObj from './js/objects/ui'
import pickBestBird from "./js/pickBestBird"
import createBirds from "./js/createBirds"
import '@/styles/index.scss'

let birds = []
let frames = 0
let prevTime = 0
let gameSpeed = 2
let singleBirdMode = false
let singleBird
const birdsTotal = 500
const dx = 2;
const state = {curr: 0, getReady: 0, Play: 1, gameOver: 2, aiMode: true, resetFrames: ()=> frames=0}
const scrn = document.getElementById('canvas');
const sctx = scrn.getContext("2d");
const start = new Date().getTime() / 1000;
const fps = 60
scrn.tabIndex = 1;

// eventListeners(state, applyBirds, singleBird)

function gameOver(){
    state.curr = state.getReady
    if (singleBirdMode) {
        singleBird.speed = 0
        singleBird.y = 100
        frames = 0
        state.curr = state.getReady
        document.getElementById("population").innerHTML = "Population: 1"
    } else {
        applyBirds("gameOver")
        setTimeout(() => {
            document.getElementById("population").innerHTML = `Population: ${birds.length}`
        }, 10);
    } 
    pipe.pipes=[];
    UI.score.curr = 0
}

const gnd = groundObj(state, dx)
const bg = backgroundObj()
const pipe = pipeObj(state, dx)
const bird = birdObj(state, gameOver)
const UI = UIObj(state)

birds = createBirds(bird, birdsTotal)
applyBirds("brain")

playBestBird.addEventListener("click", ()=> {
    singleBirdMode ? activateMultiBirds() : activateSingleBird()
})

toggleAi.addEventListener("click", ()=> {
    state.aiMode ? disableAi() : activateAi()
})

scrn.onkeydown = function keyDown(e) {
    if (e.keyCode == 32 || e.keyCode == 87 || e.keyCode == 38){  // Space Key or W key or arrow up
        switch (state.curr) {
            case state.getReady:
                state.curr = state.Play;
                state.resetFrames()
                document.getElementById("playBestBird").disabled = false;
                break;
            case state.Play:
                singleBird ? singleBird.flap() : applyBirds("flap") 
                break;
            case state.gameOver:
                state.curr = state.getReady;
                applyBirds("gameOver")
                pipe.pipes=[];
                UI.score.curr = 0;
                break;
        }  
    }
}

scrn.addEventListener("click",()=>{
    switch (state.curr) {
        case state.getReady :
            state.curr = state.Play;
            state.resetFrames()
            document.getElementById("playBestBird").disabled = false;
            break;
        case state.Play:
            singleBird && singleBird.flap() 
            break;
        case state.gameOver :
            gameOver()
            break;
    }
})

function activateSingleBird(){
    singleBirdMode = true
    singleBird = pickBestBird(birds) ? pickBestBird(birds) : bird
    document.getElementById("playBestBird").innerHTML = "Return training"
    eventListeners(state, applyBirds, singleBird)
    gameOver()
}

function activateMultiBirds(){
    singleBirdMode = false
    document.getElementById("playBestBird").innerHTML = "Best bird so far"
    eventListeners(state, applyBirds)
    gameOver()
}

function activateAi(){
    activateMultiBirds()
    state.aiMode = true
    document.getElementById("toggleAi").innerHTML = "Let me play!"
}

function disableAi(){
    activateSingleBird()
    state.aiMode = false
    document.getElementById("toggleAi").innerHTML = "Let A.I play!"
}


function applyBirds(func){
    for(let i=0; i<birds.length; i++){
        if(func === "update"){
            birds[i].update(frames, birds, singleBirdMode, birdsTotal, pipe, gnd, UI)
        } else if(func === "flap"){
            birds[i].flap()
        } else if(func === "draw"){
            birds[i].draw()
        } else if(func === "gameOver"){
            birds[i].speed = 0;
            birds[i].y = 100;
            frames = 0
        } else if(func === "think"){
            birds[i].think(pipe)
        } else if(func==="brain"){
            birds[i].brain = new NeuralNetwork(3,4,1)
        }
    }
}

speedSlider.addEventListener("change", (e)=>{
    gameSpeed = e.target.value
})

gameLoop();

function gameLoop(){ 
    const now = new Date().getTime() / 1000;
    for (let i=0; i<gameSpeed; i++){
        // if(now-prevTime>1/fps){
            update();
            //state.aiMode && 
            state.aiMode && singleBirdMode ? singleBird.think(pipe) : applyBirds("think")
            frames++;
            prevTime = now
            // }
        }
        draw();
    requestAnimationFrame(gameLoop);
}

function update(){
    singleBirdMode ? singleBird.update(frames, birds, singleBirdMode, birdsTotal, pipe, gnd, UI) : applyBirds("update")
    gnd.update();
    pipe.update(frames);
    UI.update();
}

function draw(){
    sctx.fillStyle = "#30c0df";
    sctx.fillRect(0,0,scrn.width,scrn.height)
    bg.draw();
    pipe.draw();
    singleBirdMode ? singleBird.draw() : applyBirds("draw")
    gnd.draw();
    UI.draw();
}

