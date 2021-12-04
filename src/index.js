import { NeuralNetwork } from "./nn/nn"
import { eventListeners } from './js/eventListeners'
import groundObj from "./js/objects/ground.js"
import backgroundObj from './js/objects/background'
import pipeObj from "./js/objects/pipe"
import birdObj from './js/objects/bird'
import UIObj from './js/objects/ui'
import pickBestBird from "./js/pickBestBird"
import '@/styles/index.scss'

let birds = []
let frames = 0
let prevTime = 0
let gameSpeed = 1
let bestBirdMode = false
let singleBirdMode = false
let singleBird
const birdsTotal = 500
const dx = 2;
const state = {curr: 0, getReady: 0, Play: 1, gameOver: 2, resetFrames: ()=> frames=0}
const scrn = document.getElementById('canvas');
const sctx = scrn.getContext("2d");
const start = new Date().getTime() / 1000;
const fps = 60
scrn.tabIndex = 1;

eventListeners(state, applyBirds)

function gameOver(){
    state.curr = state.getReady;
    if (singleBirdMode) {
        singleBird.speed = 0
        singleBird.y = 100
    } else {
        applyBirds("gameOver")
    } 
    pipe.pipes=[];
    UI.score.curr = 0;
}

const gnd = groundObj(state, dx)
const bg = backgroundObj()
const pipe = pipeObj(state, dx)
const bird = birdObj(state, gameOver)
const UI = UIObj(state)

function createBirds(){
    for(let i=0; i<birdsTotal; i++){
        birds.push(Object.assign({}, bird))
    }
    applyBirds("brain")
}
createBirds()

playBestBird.addEventListener("click", ()=> {
    singleBird = pickBestBird()
    console.log(singleBird)
    gameOver()
    bestBirdMode = !bestBirdMode
    singleBirdMode = !singleBirdMode
})

function applyBirds(func){
    for(let i=0; i<birds.length; i++){
        if(func === "update"){
            birds[i].update(frames, birds, birdsTotal, pipe, gnd, UI)
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
            singleBirdMode ? singleBird.think(pipe) : applyBirds("think")
            frames++;
            prevTime = now
            // }
        }
        draw();
    requestAnimationFrame(gameLoop);
}

function update(){
    singleBirdMode ? singleBird.update(frames, birds, birdsTotal, pipe, gnd, UI) : applyBirds("update")
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

