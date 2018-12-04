import { Singleton } from "@qhun-engine/base";

import { RenderContext } from "../render/RenderContext";
import { ResourceLoader } from "../resource/ResourceLoader";
import { Vector } from "../math/Vector";

@Singleton()
export class VisibleLoader {

    constructor(
        private renderContext: RenderContext,
        private mainCanvas: HTMLCanvasElement,
        private resourceLoader: ResourceLoader
    ) { }

    /**
     * starts the loading screen
     */
    public startLoadingScreen(): void {

        // get the qhun logo
        this.resourceLoader.loadImage("assets/qhunLogo.png").then(logo => {

            const logoDimension = Vector.from(
                logo.getData().width,
                logo.getData().height
            );
            const canvasDimension = Vector.from(
                this.mainCanvas.width,
                this.mainCanvas.height
            );

            // draw the logo at the center
            this.renderContext.drawImageAtPosition(
                logo,
                canvasDimension.divide(Vector.from(2).substract(logoDimension.divide(Vector.from(2)))),
                logoDimension.divide(Vector.from(4))
            );
        });
    }
}
