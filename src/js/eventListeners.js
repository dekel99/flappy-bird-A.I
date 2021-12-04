const scrn = document.getElementById('canvas');

export function eventListeners(state, applyBirds){
    scrn.onkeydown = function keyDown(e) {
        if (e.keyCode == 32 || e.keyCode == 87 || e.keyCode == 38){  // Space Key or W key or arrow up
            switch (state.curr) {
                case state.getReady:
                    state.curr = state.Play;
                    state.resetFrames()
                    break;
                case state.Play:
                    // bird.flap();
                    applyBirds("flap")
                    break;
                case state.gameOver:
                    state.curr = state.getReady;
                    // bird.speed = 0;
                    // bird.y = 100;
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
                break;
            case state.Play:
             //    bird.flap();
                applyBirds("flap")
                break;
            case state.gameOver :
                gameOver()
                break;
        }
    })
}

export function sliderListener(){
    speedSlider.addEventListener("change", (e)=>{
        gameSpeed = e.target.value
    })
}     