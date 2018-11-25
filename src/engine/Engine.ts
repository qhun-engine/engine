import { Injectable } from "./di/Injectable";
import { RenderContext } from "./render/RenderContext";
import { QhunGameOptions } from "./bootstrap/QhunGameOptions";
import { ConsolePerformanceLogger } from "./debug/ConsolePerformanceLogger";
import { ConsoleLoggerPrefix } from "./debug/ConsoleLoggerPrefix";

@Injectable()
export class Engine {

    /**
     * the render context instance
     */
    private renderContent!: RenderContext;

    /**
     * the main game canvas object
     */
    private canvasObject!: HTMLCanvasElement;

    /**
     * the game options
     */
    private gameOptions!: QhunGameOptions;

    private now!: number;
    private then!: number;
    private interval!: number;
    private delta!: number;
    private fps: number = 0;
    private oldTime: number = 0;

    constructor(
        private logger: ConsolePerformanceLogger
    ) {

        // get animation frame function
        window.requestAnimationFrame = window.requestAnimationFrame ||
            ((window as any).mozRequestAnimationFrame) ||
            (window as any).webkitRequestAnimationFrame;
    }

    /**
     * set the new render context
     * @param context the new context
     */
    public setRenderContext(context: RenderContext): this {

        this.renderContent = context;
        return this;
    }

    /**
     * set the new canvas object
     * @param context the new canvas object
     */
    public setCanvasObject(canvas: HTMLCanvasElement): this {

        this.canvasObject = canvas;
        return this;
    }

    /**
     * set the game options
     * @param options the options to set
     */
    public async setGameOptions(options: QhunGameOptions): Promise<void> {

        this.gameOptions = options;

        // update interval value
        return this.setGameLoopInterval(options.fps);
    }

    /**
     * start the engine
     */
    public start(): void {

        // set initial timings
        this.then = performance.now();

        // start looping
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    /**
     * get the current fps
     */
    public getFPS(): number {

        return this.fps;
    }

    /**
     * the main game look where everything will come together
     */
    private gameLoop(time: number): void {

        // setup next game loop cycle
        requestAnimationFrame(this.gameLoop.bind(this));

        // calculate frame time delta
        this.now = performance.now();
        this.delta = this.now - this.then;

        // game update?
        if (this.delta > this.interval) {

            // update then and timeNeedForFrame
            this.then = this.now - (this.delta % this.interval);
            this.fps = 1000 / (time - this.oldTime);
            this.oldTime = time;

            // handle other things!

            // handle user input

            // handle business logic

            // handle rendering the world
        }
    }

    /**
     * set the new game loop interval
     * @param fpsOrStrategy the target fps or strategy
     */
    private async setGameLoopInterval(fpsOrStrategy: QhunGameOptions["fps"]): Promise<void> {

        let targetFps: number = 60;

        // when a number is given
        if (typeof fpsOrStrategy === "number") {
            targetFps = fpsOrStrategy;
        }

        // auto detect fps
        if (fpsOrStrategy === "auto") {

            // log this info
            this.logger.printGrey("Using auto detect strategy to find target fps ...", ConsoleLoggerPrefix.Bootstrap);

            // wait for fps detection
            targetFps = await this.autoDetectMonitorRefreshRate();
        }

        // update interval
        this.interval = 1000 / targetFps;

        // another performance print
        this.logger.printText(`Engine will run at ${targetFps} FPS`, ConsoleLoggerPrefix.Bootstrap, 500, 250);
    }

    /**
     * tries to auto detect monitors refresh rate
     */
    private autoDetectMonitorRefreshRate(): Promise<number> {

        return new Promise<number>(resolve => {

            // use x cycles of request animation frame to detect the fps
            const cycles = 20;
            const fpsStack: number[] = [];

            // the detection method
            const calculate = (delta: number) => {

                fpsStack.unshift(delta);
                if (fpsStack.length >= cycles) {

                    const t0: number = fpsStack.pop() as number;
                    resolve(Math.floor(1000 * cycles / (delta - t0)));
                } else {

                    // next frame
                    window.requestAnimationFrame(calculate);
                }
            };

            // start first frame
            window.requestAnimationFrame(calculate);

        }).then(calculatedFps => {

            // take known refresh rates and adjust the calculated
            return [60, 100, 144, 200, calculatedFps].find((fps, index, knownFps) => {

                const next = knownFps[index + 1] || calculatedFps;
                if (Math.abs(fps - calculatedFps) < Math.abs(next - calculatedFps)) {
                    return true;
                }
                return false;
            }) as number;
        });
    }
}
