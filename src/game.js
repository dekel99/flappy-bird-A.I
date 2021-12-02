const RAD = Math.PI/180;
const scrn = document.getElementById('canvas');
const sctx = scrn.getContext("2d");
scrn.tabIndex = 1;

scrn.addEventListener("click",()=>{
   switch (state.curr) {
       case state.getReady :
           state.curr = state.Play;
           break;
       case state.Play :
        //    bird.flap();
            applyBirds("flap")
           break;
       case state.gameOver :
           gameOver()
           break;
   }
})

function gameOver(){
    state.curr = state.getReady;
    //    bird.speed = 0;
    //    bird.y = 100;
    applyBirds("gameOver")
    pipe.pipes=[];
    UI.score.curr = 0;
}

 scrn.onkeydown = function keyDown(e) {
 	if (e.keyCode == 32 || e.keyCode == 87 || e.keyCode == 38)   // Space Key or W key or arrow up
 	{
 		switch (state.curr) {
	        case state.getReady :
	            state.curr = state.Play;
	            break;
	        case state.Play :
	            // bird.flap();
                applyBirds("flap")
	            break;
	        case state.gameOver :
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
let savedBirds = []
const birdsTotal = 500
let frames = 100;
let dx = 2;
const state = {
    curr : 0,
    getReady : 0,
    Play : 1,
    gameOver : 2,
}

const gnd = {
   sprite : new Image(),
    x : 0,
    y :0,
    draw : function() {
       this.y = parseFloat(scrn.height-this.sprite.height);
       sctx.drawImage(this.sprite,this.x,this.y);
    },
    update : function() {
       if(state.curr != state.Play) return;
       this.x -= dx;
       this.x = this.x % (this.sprite.width/2);    
   }
};

const bg = {
   sprite : new Image(),
   x : 0,
   y :0,
   draw : function() {
       y = parseFloat(scrn.height-this.sprite.height)
       sctx.drawImage(this.sprite,this.x,y)
   }
}

const pipe = {
   top : {sprite : new Image()},
   bot : {sprite : new Image()},
   gap:100,
   moved: true,
   pipes : [],
   draw : function(){
      for(let i = 0;i<this.pipes.length;i++){
          let p = this.pipes[i];
          sctx.drawImage(this.top.sprite,p.x,p.y)
          sctx.drawImage(this.bot.sprite,p.x,p.y+parseFloat(this.top.sprite.height)+this.gap)
      }
   },
   update : function(){
      if(state.curr!=state.Play) return;
      if(frames%120==0){
         this.pipes.push({x:parseFloat(scrn.width),y:-220*Math.min(Math.random()+1,1.8)})
      }
      this.pipes.forEach(pipe=>{
          pipe.x -= dx;
      })
      if(this.pipes.length&&this.pipes[0].x < -this.top.sprite.width){
         this.pipes.shift()
         this.moved = true
      }
   }
}

 bird = {
    animations :
        [
            {sprite : new Image()},
            {sprite : new Image()},
            {sprite : new Image()},
            {sprite : new Image()},
        ],
    rotatation : 0,
    x : 50,
    y : 100,
    speed : 0,
    gravity : .125,
    thrust : 3.6,
    frame:0,
    score: 0,
    fitness: 0,
    draw : function() {
        let h = this.animations[this.frame].sprite.height;
        let w = this.animations[this.frame].sprite.width;
        sctx.save();
        sctx.translate(this.x,this.y);
        sctx.rotate(this.rotatation*RAD);
        sctx.drawImage(this.animations[this.frame].sprite,-w/2,-h/2);
        sctx.restore();
    },
    update : function() {
        let r = parseFloat( this.animations[0].sprite.width)/2;
        switch (state.curr) {
            case state.getReady :
                this.rotatation = 0;
                this.y +=(frames%10==0) ? Math.sin(frames*RAD) :0;
                this.frame += (frames%10==0) ? 1 : 0;
                break;
            case state.Play :
                this.frame += (frames%5==0) ? 1 : 0
                this.y += this.speed
                this.setRotation()
                this.speed += this.gravity;
                if(this.y + r  >= gnd.y||this.collisioned()){
                    savedBirds.push(birds.splice(birds.indexOf(this), 1)[0])
                    if (birds.length===0) {
                        gameOver()
                        // state.curr = state.getReady
                        state.curr = state.Play
                        nextGeneration()
                    }
                }
                
                break;
            case state.gameOver : 
                this.frame = 1;
                if(this.y + r  < gnd.y) {
                    this.y += this.speed;
                    this.setRotation()
                    this.speed += this.gravity*2;
                }
                else {
                    this.speed = 0;
                    this.y=gnd.y-r;
                    this.rotatation=90;
                    // if(!SFX.played) {
                    //     SFX.die.play();
                    //     SFX.played = true;
                    // }
                }
                break;
        }
        this.frame = this.frame%this.animations.length;       
    },
    flap : function(){
        if(this.y > 0){
            // SFX.flap.play();
            this.speed = -this.thrust;
        }
    },
    setRotation : function(){
        if(this.speed <= 0){
            this.rotatation = Math.max(-25, -25 * this.speed/(-1*this.thrust));
        }
        else if(this.speed > 0 ) {
            this.rotatation = Math.min(90, 90 * this.speed/(this.thrust*2));
        }
    },
    collisioned : function(){
        if(!pipe.pipes.length) return;
        let bird = this.animations[0].sprite;
        let x = pipe.pipes[0].x;
        let y = pipe.pipes[0].y;
        let r = bird.height/4 +bird.width/4;
        let roof = y + parseFloat(pipe.top.sprite.height);
        let floor = roof + pipe.gap;
        let w = parseFloat(pipe.top.sprite.width);
        if(this.x + r>= x){
            if(this.x + r < x + w){
                if(this.y - r <= roof || this.y + r>= floor){
                    // SFX.hit.play();
                    return true;
                }
            }
            else if(pipe.moved){
                UI.score.curr++;
                // SFX.score.play();
                pipe.moved = false;
            }    
        }
    },
    brain: null,
    think: function(){
        this.score++
        let birdPipeDistance, birdHeight
        if(pipe.pipes[0]?.x < 0){
            birdPipeDistance = pipe.pipes[1]?.x!==undefined ? pipe.pipes[1].x / scrn.width : 1
        } else {
            birdPipeDistance = pipe.pipes[0]?.x!==undefined ? pipe.pipes[0].x / scrn.width : 1
        }
        if(this.y / 290 > 1){
            birdHeight = 1
        } else if (this.y / 290 < 0){
            birdHeight = 0
        } else {
            birdHeight = this.y / 290
        }
        const pipeHeightTop = pipe.pipes[0]?.y ? (pipe.pipes[0].y + 220) / - 176 : 0.5
        const birdSpeed = this.speed / 10

        let inputs = [birdHeight, birdPipeDistance, pipeHeightTop, 0.3]
        let output = this.brain.predict(inputs)
        if(output[0]>0.5){
            this.flap()
        }
    }
 };

 const UI = {
    getReady : {sprite : new Image()},
    gameOver : {sprite : new Image()},
    tap : [{sprite : new Image()},
           {sprite : new Image()}],
    score : {
        curr : 0,
        best : 0,
    },
    x :0,
    y :0,
    tx :0,
    ty :0,
    frame : 0,
    draw : function() {
        switch (state.curr) {
            case state.getReady :
                this.y = parseFloat(scrn.height-this.getReady.sprite.height)/2;
                this.x = parseFloat(scrn.width-this.getReady.sprite.width)/2;
                this.tx = parseFloat(scrn.width - this.tap[0].sprite.width)/2;
                this.ty = this.y + this.getReady.sprite.height- this.tap[0].sprite.height;
                sctx.drawImage(this.getReady.sprite,this.x,this.y);
                sctx.drawImage(this.tap[this.frame].sprite,this.tx,this.ty)
                break;
            case state.gameOver :
                this.y = parseFloat(scrn.height-this.gameOver.sprite.height)/2;
                this.x = parseFloat(scrn.width-this.gameOver.sprite.width)/2;
                this.tx = parseFloat(scrn.width - this.tap[0].sprite.width)/2;
                this.ty = this.y + this.gameOver.sprite.height- this.tap[0].sprite.height;
                sctx.drawImage(this.gameOver.sprite,this.x,this.y);
                sctx.drawImage(this.tap[this.frame].sprite,this.tx,this.ty)
                break;
        }
        this.drawScore();
    },
    drawScore : function() {
            sctx.fillStyle = "#FFFFFF";
            sctx.strokeStyle = "#000000";
        switch (state.curr) {
            case state.Play :
                sctx.lineWidth = "2";
                sctx.font = "35px Squada One";
                sctx.fillText(this.score.curr,scrn.width/2-5,50);
                sctx.strokeText(this.score.curr,scrn.width/2-5,50);
                break;
            case state.gameOver :
                    sctx.lineWidth = "2";
                    sctx.font = "40px Squada One";
                    let sc = `SCORE :     ${this.score.curr}`;
                    try {
                        this.score.best = Math.max(this.score.curr,localStorage.getItem("best"));
                        localStorage.setItem("best",this.score.best);
                        let bs = `BEST  :     ${this.score.best}`;
                        sctx.fillText(sc,scrn.width/2-80,scrn.height/2+0);
                        sctx.strokeText(sc,scrn.width/2-80,scrn.height/2+0);
                        sctx.fillText(bs,scrn.width/2-80,scrn.height/2+30);
                        sctx.strokeText(bs,scrn.width/2-80,scrn.height/2+30);
                    }
                    catch(e) {
                        sctx.fillText(sc,scrn.width/2-85,scrn.height/2+15);
                        sctx.strokeText(sc,scrn.width/2-85,scrn.height/2+15);
                    }
                    
                break;
        }
    },
    update : function() {
        if(state.curr == state.Play) return;
        this.frame += (frames % 10==0) ? 1 :0;
        this.frame = this.frame % this.tap.length;
    }

 };

gnd.sprite.src="img/ground.png";
bg.sprite.src="img/BG.png";
pipe.top.sprite.src="img/toppipe.png";
pipe.bot.sprite.src="img/botpipe.png";
UI.gameOver.sprite.src="img/go.png";
UI.getReady.sprite.src="img/getready.png";
UI.tap[0].sprite.src="img/tap/t0.png";
UI.tap[1].sprite.src="img/tap/t1.png";
bird.animations[0].sprite.src="img/bird/b0.png";
bird.animations[1].sprite.src="img/bird/b1.png";
bird.animations[2].sprite.src="img/bird/b2.png";
bird.animations[3].sprite.src="img/bird/b0.png";

birds = []
function createBirds(){
    for(let i=0; i<birdsTotal; i++){
        birds.push(Object.assign({}, bird))
    }
    applyBirds("brain")
}
createBirds()

function applyBirds(func){
    for(let i=0; i<birds.length; i++){
        if(func === "update"){
            birds[i].update()
        } else if(func === "flap"){
            birds[i].flap()
        } else if(func === "draw"){
            birds[i].draw()
        } else if(func === "gameOver"){
            birds[i].speed = 0;
            birds[i].y = 100; 
        } else if(func === "think"){
            birds[i].think()
        } else if(func==="brain"){
            birds[i].brain = new NeuralNetwork(4,4,1)
        }
    }
}

const start = new Date().getTime() / 1000;
let prevTime = 0
const fps = 60
let gameSpeed = 1
gameLoop();

speedSlider.addEventListener("change", (e)=>{
    gameSpeed = e.target.value
})

function gameLoop(){ 
    const now = new Date().getTime() / 1000;
    for (let i=0; i<gameSpeed; i++){
        // if(now-prevTime>1/fps){
            update();
            // bird.think()
            applyBirds("think")
            frames++;
            prevTime = now
            // }
        }
        draw();
    requestAnimationFrame(gameLoop);
}
function update(){
//    bird.update();
   applyBirds("update")
  
   gnd.update();
   pipe.update();
   UI.update();
}

function draw(){
   sctx.fillStyle = "#30c0df";
   sctx.fillRect(0,0,scrn.width,scrn.height)
   bg.draw();
   pipe.draw();
//    bird.draw();
    applyBirds("draw")
   gnd.draw();
   UI.draw();
}
