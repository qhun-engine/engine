import { Singleton } from "../constraint/Singleton";
import { EngineError } from "../exception/EngineError";
import { Inject } from "../di/Inject";
import { ConsolePerformanceLogger } from "../debug/ConsolePerformanceLogger";
import { Engine } from "../Engine";
import { QhunGameOptions } from "./QhunGameOptions";
import { RenderContextFactory } from "../render/RenderContextFactory";

/**
 * responsable for finding the target canvas and enable the qhun engine
 * for this canvas object
 */
@Singleton()
export class EngineBootstrap {

    /**
     * console logger
     */
    @Inject()
    private logger!: ConsolePerformanceLogger;

    /**
     * main engine object that needs to be filled while bootstrapping the engine
     */
    @Inject()
    private engine!: Engine;

    /**
     * the canvas element
     */
    private canvas!: HTMLCanvasElement;

    /**
     * the renderer context factory to get the rendering engine
     */
    @Inject()
    private renderContextFactory!: RenderContextFactory;

    constructor(
        private options: QhunGameOptions
    ) { }

    /**
     * bootstraps the engine and prepare everything in order to
     * create the main game class
     */
    public async bootstrapEngine(): Promise<void> {

        // wait for document ready event
        await this.waitForDocumentReadyEvent();

        // print dom ready performance
        this.logger.printText("DOM ready event fired");

        // find game canvas
        this.findGameCanvas();

        // construct context renderer
        await this.constructRenderContext();

    }

    /**
     * finding the main game canvas
     */
    private findGameCanvas(): void {

        const canvas = document.getElementById(this.options.canvasId) as HTMLCanvasElement;

        // check result
        if (!canvas) {

            throw new EngineError(`Could not find the main game canvas element with id ${this.options.canvasId}. Make sure your canvas element exists!`);
        }

        // add canvas to the engine
        this.canvas = canvas;
        this.engine.setCanvasObject(canvas);
    }

    /**
     * resolves the promise when the document ready event has been fired
     */
    private waitForDocumentReadyEvent(): Promise<void> {

        return new Promise((resolve, reject) => {
            // the handler or resolver function
            const handler = () => {

                // remove error listener
                document.removeEventListener("error", reject, false);

                // resolve the promise
                resolve();
            };

            // add an apropiate document event listener
            document.addEventListener("DOMContentLoaded", handler, false);
            document.addEventListener("error", reject, false);
        });
    }

    /**
     * constructs the rendering context for the engine
     */
    private async constructRenderContext(): Promise<void> {

        // get engine
        const engine = this.renderContextFactory.createRenderContext(this.canvas, this.options.renderer);

        // store engine
        this.engine.setRenderContext(engine);
    }

}
