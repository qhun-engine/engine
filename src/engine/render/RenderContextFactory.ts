import { Injectable } from "../di/Injectable";
import { RenderContext } from "./RenderContext";
import { QhunGameOptions } from "../bootstrap/QhunGameOptions";
import { CanvasRenderContext } from "./canvas/CanvasRenderContext";
import { WebGLRenderContext } from "./webgl/WebGLRenderContext";
import { ConsolePerformanceLogger } from "../debug/ConsolePerformanceLogger";
import { ConsoleLoggerPrefix } from "../debug/ConsoleLoggerPrefix";

/**
 * responsable for creating the desired rendering context based of
 * game desicion or browser support
 */
@Injectable()
export class RenderContextFactory {

    constructor(
        private logger: ConsolePerformanceLogger
    ) { }

    /**
     * get the desired render context
     * @param canvas the main canvas game object
     * @param detectionMethod the detection strategy
     */
    public createRenderContext(canvas: HTMLCanvasElement, detectionMethod: QhunGameOptions["renderer"]): RenderContext {

        // check by method
        switch (detectionMethod) {

            case "auto": return this.autoDetectRenderContext(canvas);
            case "canvas":
                this.logger.printText("Using CanvasRenderer as rendering method", ConsoleLoggerPrefix.Bootstrap);
                return new CanvasRenderContext(canvas, canvas.getContext("2d")!);
            case "webgl":
                this.logger.printText("Using WebGLRenderer as rendering method", ConsoleLoggerPrefix.Bootstrap);
                return new WebGLRenderContext(canvas, (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))!);
        }
    }

    /**
     * auto detects the render context based on support
     * @param canvas the canvas element
     */
    private autoDetectRenderContext(canvas: HTMLCanvasElement): RenderContext {

        // print log
        this.logger.printGrey("Auto detect supported rendering engine ...", ConsoleLoggerPrefix.Bootstrap);

        // try to get a webgl context
        const tempCanvas = document.createElement("canvas");
        if (
            tempCanvas.getContext("webgl") instanceof WebGLRenderingContext ||
            tempCanvas.getContext("experimental-webgl") instanceof WebGLRenderingContext
        ) {
            return this.createRenderContext(canvas, "webgl");
        }

        // fallback
        return this.createRenderContext(canvas, "canvas");

    }
}
