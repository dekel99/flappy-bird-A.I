import topPipeImg from "../../images/toppipe.png"
import botPipeImg from "../../images/botpipe.png"

const scrn = document.getElementById('canvas');
const sctx = scrn.getContext("2d");

export default function pipe(state, dx){
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
        update : function(frames){
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
    pipe.top.sprite.src = topPipeImg
    pipe.bot.sprite.src = botPipeImg

    return pipe
}