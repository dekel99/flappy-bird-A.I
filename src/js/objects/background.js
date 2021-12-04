import backgroundImg from "../../images/BG.png"

const scrn = document.getElementById('canvas');
const sctx = scrn.getContext("2d");

export default function background(){
    const bg = {
        sprite : new Image(),
        x : 0,
        y :0,
        draw : function() {
            let y = parseFloat(scrn.height-this.sprite.height)
            sctx.drawImage(this.sprite,this.x,y)
        }
    }
    bg.sprite.src = backgroundImg
    return bg
}