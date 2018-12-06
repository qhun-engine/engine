import { Singleton, Inject } from "@qhun-engine/base";
import { RenderContext } from "./render/RenderContext";
import { SceneManager } from "./scene/SceneManager";
import { Engine } from "./Engine";
import { QhunGameOptions } from "./bootstrap/QhunGameOptions";
import { InternalMessageBus } from "./message/InternalMessageBus";

@Singleton()
export class GameLoop {

    @Inject()
    private sceneManager!: SceneManager;

    @Inject()
    private messageBus!: InternalMessageBus;

    /**
     * time since the last frame draw
     */
    private delta: number = 0;

    /**
     * is the game loop running?
     */
    private isRunning: boolean = false;

    /**
     * the time in milliseconds in wich the update game logic function will be called
     */
    private step: number = 1000 / (this.options.fps as number);

    /**
     * the last timestamp
     */
    private last: number = 0;

    /**
     * a sanity check var to dont run into spiral of death
     */
    private updateSteps: number = 0;

    constructor(
        private engine: Engine,
        private options: QhunGameOptions,
        private renderContext: RenderContext,
        private updateHook: (delta: number, timeDelta: number, engine: Engine) => void,
        private drawHook: (delta: number, timeDelta: number, renderContent: RenderContext, engine: Engine) => void
    ) {

        // start the loop
        window.requestAnimationFrame(this.gameLoop.bind(this));
    }

    /**
     * starts/resumes the game loop
     */
    public start(): void {

        this.isRunning = true;
        this.last = this.getTimestamp();
    }

    /**
     * stops the game loop
     */
    public stop(): void {

        this.isRunning = false;
    }

    /**
     * generates the current timestamp with high precision
     */
    private getTimestamp(): number {

        if (window.performance && window.performance.now) {
            return window.performance.now();
        }

        return Date.now();
    }

    /**
     * the main game loop
     */
    private gameLoop(timestamp: number): void {

        // throttle the frame rate
        if (timestamp < this.last + this.step) {

            // stop checking other things
            window.requestAnimationFrame(this.gameLoop.bind(this));
            return;
        }

        // only continue if the loop should run
        if (!this.isRunning) {

            window.requestAnimationFrame(this.gameLoop.bind(this));
            return;
        }

        // calculate the delta
        const timePassed = timestamp - this.last;
        this.delta += timePassed;
        this.last = timestamp;

        // reset update counter
        this.updateSteps = 0;

        // update game logic
        while (this.delta >= this.step) {

            // update!
            this.updatePhase(this.step, timePassed);

            // decrease the delta
            this.delta -= this.step;

            // sanity check
            if (++this.updateSteps > 240) {

                // call panic mode and escape from the update hell
                this.gameLoopPanic();
                break;
            }
        }

        // render
        this.drawPhase(this.delta, timePassed);

        // next frame
        window.requestAnimationFrame(this.gameLoop.bind(this));
    }

    /**
     * players game state is away from the real state, snap the player to the authoritative state
     */
    private gameLoopPanic(): void {

        // for now, reset the delta
        this.delta = 0;
    }

    /**
     * game business login update phase
     * @param delta the update delta
     * @param delta the time delta
     */
    private updatePhase(delta: number, timeDelta: number): void {

        // dispatch messages
        this.messageBus.dispatch();

        // execute life cycle hooks
        this.updateHook(delta, timeDelta, this.engine);

        // scene manager update
        this.sceneManager.update(delta, timeDelta, this.engine);
    }

    /**
     * game drawing phase
     * @param delta the update delta
     * @param delta the time delta
     */
    private drawPhase(delta: number, timeDelta: number): void {

        // call before draw render context
        this.renderContext.before();

        // execute life cycle hooks
        this.drawHook(delta, timeDelta, this.renderContext, this.engine);

        // scene manager draw
        this.sceneManager.draw(delta, timeDelta, this.renderContext, this.engine);

        // draw debug info
        this.printDebugInformation();

        this.renderContext.after();
    }

    /**
     * prints debug information if enabled
     */
    private printDebugInformation(): void {

        if (this.options.debugMode) {

            /*this.engineUsageStack.unshift(Math.floor(this.getEngineUsage()));
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
            }*/
        }
    }
}
