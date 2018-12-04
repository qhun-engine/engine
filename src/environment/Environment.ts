import { Injectable } from "@qhun-engine/base";

import { DimensionSize } from "../constraint/Dimension";
import { MessageBus } from "../message/MessageBus";
import { WindowResizeMessage } from "../message/event/environment/WindowResizeMessage";

/**
 * a class that cares about screen width/height, resize events, browser
 * capabilities ...
 */
@Injectable()
export class Environment {

    /**
     * the main canvas object
     */
    private mainCanvas!: HTMLCanvasElement;

    constructor(
        private messageBus: MessageBus
    ) {

        // listen to window resize changes
        this.listenToResizeChanges();
    }

    /**
     * set the main canvas object
     * @param canvas the main canvas object
     */
    public setCanvasObject(canvas: HTMLCanvasElement): void {

        this.mainCanvas = canvas;
    }

    /**
     * get the current viewport (canvas) height/width
     */
    public getViewportSize(): DimensionSize {

        return {
            w: this.mainCanvas.width,
            h: this.mainCanvas.height
        };
    }

    /**
     * starts listen to window resize changes
     */
    private listenToResizeChanges(): void {

        window.onresize = event => {

            // send message
            this.messageBus.send(new WindowResizeMessage(event));

            // handle canvas resize
            this.updateCanvasDimension();
        };
    }

    /**
     * handles canvas resize events
     */
    public updateCanvasDimension(): void {

        this.mainCanvas.width = window.innerWidth;
        this.mainCanvas.setAttribute("width", `${window.innerWidth}px`);
        this.mainCanvas.height = window.innerHeight;
        this.mainCanvas.setAttribute("height", `${window.innerHeight}px`);
    }

}
