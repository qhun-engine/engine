import { ClassConstructor } from "../constraint/ClassConstructor";
import { Injectable } from "../di/Injectable";
import { poweredBy } from "./poweredBy";
import { QhunGameOptions } from "./QhunGameOptions";
import { EngineBootstrap } from "./EngineBootstrap";
import { Injector } from "../di/Injector";
import { ConsolePerformanceLogger } from "../debug/ConsolePerformanceLogger";

/**
 * The entry point of your game where the magic happens. Put this decorator onto your main class
 * @param options @todo write options
 */
export function QhunGame(options: Partial<QhunGameOptions> = {
    exposeGameInstance: false,
    canvasId: "qhunGameCanvas",
    renderer: "auto"
}): ClassDecorator {

    // apply default values
    options.exposeGameInstance = typeof options.exposeGameInstance === "boolean" ? options.exposeGameInstance : false;
    options.canvasId = options.canvasId ? options.canvasId : "qhunGameCanvas";
    options.renderer = options.renderer ? options.renderer : "auto";

    // get performance debug logger
    const logger = Injector.getInstance().instantiateClass(ConsolePerformanceLogger);

    return <ClassDecorator>(<T extends ClassConstructor>(target: T) => {

        // print powered by
        poweredBy.forEach(line => {
            console.log(`%c${line.text}`, line.style.join(" "));
        });

        // enable engine bootstraping
        const bootstrap = new EngineBootstrap(options as Required<QhunGameOptions>);

        // print before engine bootstrap
        logger.printText("Engine and game sourcecode evaluated");
        logger.printGrey("Awaiting engine bootstrap ...");

        // await bootstraping
        bootstrap.bootstrapEngine().then(() => {

            // engine bootstrap done
            logger.printText("Engine bootstrap finished");
            logger.printGrey("Creating main game class ...");

            // construct main game class
            const gameClass = class QhunGameImpl extends (Injectable()(target) as T) { };
            const gameInstance: any = new gameClass();

            // print game class created performance
            logger.printText("Main game class created");

            // exposing instance?
            if (options.exposeGameInstance) {
                (window as any).game = gameInstance;

                logger.printText("Exposing main game class to window");
                logger.log(gameInstance);
            }

            // print total performance
            logger.fillLine();
            logger.printTotalText("Bootstrap phase complete");

        }, error => {

            console.error("Error while bootstrapping the engine.");
            console.error(error);
        });
    });
}
