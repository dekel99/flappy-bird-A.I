const scrn = document.getElementById('canvas');

export function eventListeners(state, applyBirds, singleBird){
    // scrn.onkeydown = function keyDown(e) {
    //     if (e.keyCode == 32 || e.keyCode == 87 || e.keyCode == 38){  // Space Key or W key or arrow up
    //         switch (state.curr) {
    //             case state.getReady:
    //                 state.curr = state.Play;
    //                 state.resetFrames()
    //                 document.getElementById("playBestBird").disabled = false;
    //                 break;
    //             case state.Play:
    //                 singleBird ? singleBird.flap() : applyBirds("flap") 
    //                 break;
    //             case state.gameOver:
    //                 state.curr = state.getReady;
    //                 applyBirds("gameOver")
    //                 pipe.pipes=[];
    //                 UI.score.curr = 0;
    //                 break;
    //         }  
    //     }
    // }

    // scrn.addEventListener("click",(singleBird)=>{
    //     switch (state.curr) {
    //         case state.getReady :
    //             state.curr = state.Play;
    //             state.resetFrames()
    //             document.getElementById("playBestBird").disabled = false;
    //             break;
    //         case state.Play:
    //             singleBird && singleBird.flap() 
    //             break;
    //         case state.gameOver :
    //             gameOver()
    //             break;
    //     }
    // })
}

// export function sliderListener(){
//     speedSlider.addEventListener("change", (e)=>{
//         gameSpeed = e.target.value
//     })
// }     