import { Singleton } from "../constraint/Singleton";
import { EngineError } from "../exception/EngineError";
import { Inject } from "../di/Inject";
import { ConsolePerformanceLogger } from "../debug/ConsolePerformanceLogger";

/**
 * responsable for finding the target canvas and enable the qhun engine
 * for this canvas object
 */
@Singleton()
export class EngineBootstrap {

    /**
     * the main game canvas element
     */
    private canvas!: HTMLCanvasElement;

    @Inject()
    private logger!: ConsolePerformanceLogger;

    constructor(
        private canvasId: string
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
    }

    /**
     * finding the main game canvas
     */
    private findGameCanvas(): void {

        this.canvas = document.getElementById(this.canvasId) as HTMLCanvasElement;

        // check result
        if (!this.canvas) {

            throw new EngineError(`Could not find the main game canvas element with id ${this.canvasId}. Make sure your canvas element exists!`);
        }
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

}
