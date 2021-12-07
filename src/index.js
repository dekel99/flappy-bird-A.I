import { NeuralNetwork } from "./nn/nn"
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
let gameSpeed = 1
let singleBirdMode = false
let singleBird
const birdsTotal = 500
const dx = 2;
const state = {curr: 0, getReady: 0, Play: 1, gameOver: 2, aiMode: true}
const scrn = document.getElementById('canvas');
const sctx = scrn.getContext("2d");
scrn.tabIndex = 1;

// Create game objects
const gnd = groundObj(state, dx)
const bg = backgroundObj()
const pipe = pipeObj(state, dx)
const bird = birdObj(state, gameOver)
const UI = UIObj(state)

// Takes the bird obj and makes array of copies based on birdsTotal length
birds = createBirds(bird, birdsTotal)

// Gives birds array a new neural network
applyBirds("brain")

// Event listeners
playBestBird.addEventListener("click", ()=> {
    singleBirdMode ? activateMultiBirds() : activateSingleBird()
})

toggleAi.addEventListener("click", ()=> {
    state.aiMode ? disableAi() : activateAi()
})

speedSlider.addEventListener("change", (e)=>{
    gameSpeed = e.target.value
    if(gameSpeed==3){
        gameSpeed = 4
    } else if(gameSpeed==4){
        gameSpeed = 8
    } else if(gameSpeed==5){
        gameSpeed = 100
    }
})

scrn.onkeydown = function keyDown(e) {
    if (e.keyCode == 32 || e.keyCode == 87 || e.keyCode == 38){  // Space Key or W key or arrow up
        switch (state.curr) {
            case state.getReady:
                state.curr = state.Play;
                document.getElementById("playBestBird").disabled = false;
                break;
            case state.Play:
                singleBird && singleBird.flap()
                break;
            case state.gameOver:
                gameOver()
                break;
        }  
    }
}

scrn.addEventListener("click",()=>{
    switch (state.curr) {
        case state.getReady :
            state.curr = state.Play;
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

// Game functions
function activateSingleBird(){
    singleBirdMode = true
    singleBird = state.aiMode ? pickBestBird(birds) : bird
    document.getElementById("playBestBird").innerHTML = "Return training"
    gameOver()
}

function activateMultiBirds(){
    singleBirdMode = false
    document.getElementById("playBestBird").innerHTML = "Best bird so far"
    gameOver()
}

function activateAi(){
    state.aiMode = true
    activateMultiBirds()
    document.getElementById("toggleAi").innerHTML = "Let me play!"
    document.getElementById("ai-config").style.display = "flex"
}

function disableAi(){
    state.aiMode = false
    gameSpeed = 1
    activateSingleBird()
    document.getElementById("toggleAi").innerHTML = "Let A.I play!"
    document.getElementById("ai-config").style.display = "none"
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

function gameOver(){
    state.curr = state.getReady
    frames = 0
    pipe.pipes = []
    UI.score.curr = 0
    if (singleBirdMode) {
        singleBird.speed = 0
        singleBird.y = 100
        document.getElementById("population").innerHTML = "Population: 1"
        return
    } 
    applyBirds("gameOver")
    setTimeout(() => {
        document.getElementById("population").innerHTML = `Population: ${birds.length}`
    }, 10);
}

// Init game loop
gameLoop();
function gameLoop(){ 
    for (let i=0; i<gameSpeed; i++){
        update();
        state.aiMode && singleBirdMode ? singleBird.think(pipe) : applyBirds("think")
        frames++;
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

