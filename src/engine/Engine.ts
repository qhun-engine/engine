import { Injectable } from "./di/Injectable";
import { RenderContext } from "./render/RenderContext";
import { QhunGameOptions } from "./bootstrap/QhunGameOptions";
import { ConsolePerformanceLogger } from "./debug/ConsolePerformanceLogger";
import { ConsoleLoggerPrefix } from "./debug/ConsoleLoggerPrefix";
import { GameLoop } from "./GameLoop";
import { Environment } from "./environment/Environment";

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

    /**
     * the game loop instance
     */
    private gameLoop!: GameLoop;

    /**
     * life cycle hooks into the engine
     */
    private lifeCycleHooks: {
        draw: ((...args: any[]) => void)[],
        update: ((...args: any[]) => void)[]
    } = { draw: [], update: [] };

    constructor(
        private logger: ConsolePerformanceLogger,
        private environment: Environment
    ) {

        // get animation frame function
        window.requestAnimationFrame = window.requestAnimationFrame ||
            (window as any).mozRequestAnimationFrame ||
            (window as any).webkitRequestAnimationFrame ||
            (window as any).msRequestAnimationFrame;
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
        this.environment.setCanvasObject(canvas);
        return this;
    }

    /**
     * get the main canvas object
     */
    public getCanvasObject(): HTMLCanvasElement {

        return this.canvasObject;
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

        // create game loop
        this.gameLoop = new GameLoop(
            this,
            this.gameOptions,
            this.renderContent,
            this.lifeCycleUpdate.bind(this),
            this.lifeCycleDraw.bind(this)
        );

        // start the loop
        this.gameLoop.start();
    }

    /**
     * get the current fps
     */
    public getFPS(): number {

        // return this.fps;
        return 0;
    }

    /**
     * get the cpu usage of the engine by evaluating the
     * maximal possible (target fps) fps with the current fps
     */
    public getEngineUsage(): number {

        /*// 0 check
        if (this.timePerFrame === 0) {
            return 0;
        }

        // time to render frame at fps rate
        const timeRenderFps = (1 / this.targetFps) * 1000;

        // get pct
        return this.timePerFrame * 100 / timeRenderFps;*/
        return 0;
    }

    public addLifeCycleHook(phase: "draw", method: (delta: number, renderContent: RenderContext, engine: Engine) => void): void;
    public addLifeCycleHook(phase: "update", method: (delta: number, engine: Engine) => void): void;
    public addLifeCycleHook(phase: string, method: (...args: any[]) => void): void {

        if (typeof this.lifeCycleHooks[phase as "draw"] === "object") {
            this.lifeCycleHooks[phase as "draw"].push(method);
        }
    }

    private lifeCycleUpdate(...args: any[]): void {

        this.lifeCycleHooks.update.forEach(handler => handler(...args));
    }

    private lifeCycleDraw(...args: any[]): void {

        this.lifeCycleHooks.draw.forEach(handler => handler(...args));
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
        this.gameOptions.fps = targetFps;

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
