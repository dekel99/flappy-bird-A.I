import gameOverImg from "../../images/go.png"
import getReadyImg from "../../images/getready.png"
import tap0Img from "../../images/tap/t0.png"
import tap1Img from "../../images/tap/t1.png"

const scrn = document.getElementById('canvas');
const sctx = scrn.getContext("2d");

export default function UI(state){
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
    }
    UI.gameOver.sprite.src = gameOverImg
    UI.getReady.sprite.src = getReadyImg
    UI.tap[0].sprite.src = tap0Img
    UI.tap[1].sprite.src = tap1Img

    return UI
}