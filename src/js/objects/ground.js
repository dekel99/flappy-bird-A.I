import groundImg from "../../images/ground.png"

const scrn = document.getElementById('canvas');
const sctx = scrn.getContext("2d");

export default function ground(state, dx){
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
    gnd.sprite.src = groundImg
    return gnd
}

