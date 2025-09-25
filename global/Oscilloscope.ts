import { ColorConfig } from "../editor/ColorConfig";
import { events } from "./Events";

export class oscilloscopeCanvas {
    public _EventUpdateCanvas:Function;

    constructor(public readonly canvas: HTMLCanvasElement, readonly scale: number = 1) {
        this._EventUpdateCanvas = function(directlinkL: Float32Array, directlinkR ?: Float32Array): void {
            if(directlinkR) {
                var ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

                ctx.fillStyle = ColorConfig.getComputed("--editor-background");
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.fillStyle = ColorConfig.getComputed("--oscilloscope-line-L");
                for (let i: number = directlinkL.length - 1; i >= directlinkL.length - 1 - (canvas.width/scale); i--) {
                    let x = i - (directlinkL.length - 1) + (canvas.width/scale);
                    let yl = (directlinkL[i] * (canvas.height/scale / 2) + (canvas.height/scale / 2));

                    ctx.fillRect((x - 1)*scale, (yl - 1)*scale, 1*scale, 1.5*scale);
                    if (x == 0) break;
                }
                ctx.fillStyle = ColorConfig.getComputed("--oscilloscope-line-R"); //less ctx style calls = less expensive??? also avoiding uncached colors
                for (let i: number = directlinkR.length - 1; i >= directlinkR.length - 1 - (canvas.width/scale); i--) {
                    let x = i - (directlinkR.length - 1) + (canvas.width/scale);
                    let yr = (directlinkR[i] * (canvas.height/scale / 2) + (canvas.height/scale / 2));
                    
                    ctx.fillRect((x - 1)*scale, (yr - 1)*scale, 1*scale, 1.5*scale);
                    if (x == 0) break;
                }
            }
        };
        events.listen("oscilloscopeUpdate", this._EventUpdateCanvas);
    }

    
}
