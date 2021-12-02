export default bird = {
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
                    return true;
                }
            }
            else if(pipe.moved){
                UI.score.curr++;
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
