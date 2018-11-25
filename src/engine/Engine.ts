import { Injectable } from "./di/Injectable";
import { RenderContext } from "./render/RenderContext";
import { QhunGameOptions } from "./bootstrap/QhunGameOptions";
import { ConsolePerformanceLogger } from "./debug/ConsolePerformanceLogger";
import { ConsoleLoggerPrefix } from "./debug/ConsoleLoggerPrefix";
import { SceneManager } from "./scene/SceneManager";
import { MessageBus } from "./message/MessageBus";
import { Vector } from "./math/Vector";

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
    private targetFps!: number;
    private fps: number = 0;
    private oldTime: number = 0;
    private timePerFrame: number = 0;

    private engineUsageStack: number[] = [];
    private fpsStack: number[] = [];

    /**
     * life cycle hooks into the engine
     */
    private lifeCycleHooks: {
        draw: ((delta: number, renderContent: RenderContext, engine: Engine) => void)[],
        update: ((delta: number, engine: Engine) => void)[]
    } = { draw: [], update: [] };

    constructor(
        private logger: ConsolePerformanceLogger,
        private sceneManager: SceneManager,
        private messageBus: MessageBus
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
     * get the cpu usage of the engine by evaluating the
     * maximal possible (target fps) fps with the current fps
     */
    public getEngineUsage(): number {

        // 0 check
        if (this.timePerFrame === 0) {
            return 0;
        }

        // time to render frame at fps rate
        const timeRenderFps = (1 / this.targetFps) * 1000;

        // get pct
        return this.timePerFrame * 100 / timeRenderFps;
    }

    public addLifeCycleHook(phase: "draw", method: (delta: number, renderContent: RenderContext, engine: Engine) => void): void;
    public addLifeCycleHook(phase: "update", method: (delta: number, engine: Engine) => void): void;
    public addLifeCycleHook(phase: string, method: (...args: any[]) => void): void {

        if (typeof this.lifeCycleHooks[phase as "draw"] === "object") {
            this.lifeCycleHooks[phase as "draw"].push(method);
        }
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
            const tmpDelta = time - this.oldTime;
            this.fps = 1000 / (time - this.oldTime);
            this.oldTime = time;

            // handle other things!
            this.messageBus.dispatch();

            // handle user input
            this.messageBus.dispatch();

            // handle business logic
            this.lifeCycleHooks.update.forEach(handler => handler(tmpDelta, this));
            this.sceneManager.update(tmpDelta, this);
            this.messageBus.dispatch();

            // handle rendering the world
            this.renderContent.before();
            this.lifeCycleHooks.draw.forEach(handler => handler(tmpDelta, this.renderContent, this));
            this.sceneManager.draw(tmpDelta, this.renderContent, this);
            this.printDebugInformation();
            this.messageBus.dispatch();

            // calculate time per frame
            this.timePerFrame = performance.now() - this.now;
        }
    }

    /**
     * prints debug information if enabled
     */
    private printDebugInformation(): void {

        if (this.gameOptions.debugMode) {

            this.engineUsageStack.unshift(Math.floor(this.getEngineUsage()));
            this.fpsStack.unshift(Math.floor(this.getFPS()));

            if (this.engineUsageStack.length > 250) {

                // remove oldest element
                this.engineUsageStack.pop();
                this.fpsStack.pop();

                // calc average
                const avgEngine = Math.floor(
                    this.engineUsageStack.reduce((accumulator, currentValue) => accumulator + currentValue) / this.engineUsageStack.length
                );
                const avgFps = Math.floor(
                    this.fpsStack.reduce((accumulator, currentValue) => accumulator + currentValue) / this.engineUsageStack.length
                );

                this.renderContent.drawText(`FPS: ${avgFps} - Engine Usage: ${avgEngine}%`, Vector.from(10, 20));
            }
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
        this.targetFps = targetFps;

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
