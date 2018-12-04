import { Singleton, EngineError, Inject } from "@qhun-engine/base";

import { ConsolePerformanceLogger } from "../debug/ConsolePerformanceLogger";
import { Engine } from "../Engine";
import { QhunGameOptions } from "./QhunGameOptions";
import { RenderContextFactory } from "../render/RenderContextFactory";
import { ConsoleLoggerPrefix } from "../debug/ConsoleLoggerPrefix";
import { MessageBus } from "../message/MessageBus";
import { EngineBootstrapFinishedMessage } from "../message/internal/state/EngineBootstrapFinishedMessage";
import { ResourceManager } from "../resource/ResourceManager";
import { EngineReadyMessage } from "../message/internal/state/EngineReadyMessage";
import { VisibleLoader } from "./VisibleLoader";
import { ResourceLoader } from "../resource/ResourceLoader";
import { Environment } from "../environment/Environment";
import { InputRegistar } from "../input/InputRegistar";

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

    @Inject()
    private messageBus!: MessageBus;

    @Inject()
    private resourceManager!: ResourceManager;

    @Inject()
    private resourceLoader!: ResourceLoader;

    @Inject()
    private environment!: Environment;

    @Inject()
    private input!: InputRegistar;

    /**
     * the canvas element
     */
    private canvas!: HTMLCanvasElement;

    /**
     * the visible loading screen
     */
    private visibleLoader!: VisibleLoader;

    /**
     * the renderer context factory to get the rendering engine
     */
    @Inject()
    private renderContextFactory!: RenderContextFactory;

    constructor(
        private options: QhunGameOptions
    ) { }

    /**
     * the final bootstrap method
     */
    public engineReady(): void {

        // send engine ready message
        this.messageBus.send(new EngineReadyMessage());
    }

    /**
     * bootstraps the engine and prepare everything in order to
     * create the main game class
     */
    public async bootstrapEngine(): Promise<Engine> {

        // wait for document ready event
        await this.waitForDocumentReadyEvent();

        // set options
        await this.engine.setGameOptions(this.options);

        // print dom ready performance
        this.logger.printText("DOM ready event fired", ConsoleLoggerPrefix.Bootstrap);

        // find game canvas
        this.findGameCanvas();

        // update environment canvas dimension
        this.environment.updateCanvasDimension();

        // enable input registar
        this.input.detectBrowserInputCapabilities();

        // construct context renderer
        await this.constructRenderContext();

        // show loading screen
        this.visibleLoader.startLoadingScreen();

        // send bootstrap finished message
        this.messageBus.sendImmediately(new EngineBootstrapFinishedMessage(this.engine));

        // return constructed engine
        return this.engine;
    }

    /**
     * loading the game
     */
    public async loadingGame(): Promise<void> {

        // info print
        this.logger.printGrey("Awaiting asset loading ...");

        await this.resourceManager.loadDeclaredResources();

        // print
        this.logger.printText("Loaded declared assets", ConsoleLoggerPrefix.Asset, 10000, 50000);
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

        // get rendering context
        const renderContext = this.renderContextFactory.createRenderContext(this.canvas, this.options.renderer);

        // start the visible loading screen
        this.visibleLoader = new VisibleLoader(renderContext, this.canvas, this.resourceLoader);

        // store engine
        this.engine.setRenderContext(renderContext);
    }

}
