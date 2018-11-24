import { ClassConstructor } from "../constraint/ClassConstructor";
import { Injectable } from "../di/Injectable";
import { poweredBy } from "./poweredBy";
import { QhunGameOptions } from "./QhunGameOptions";

/**
 * The entry point of your game where the magic happens. Put this decorator onto your main class
 * @param options @todo write options
 */
export function QhunGame(options: QhunGameOptions = {
    exposeGameInstance: false
}): ClassDecorator {

    return <ClassDecorator>(<T extends ClassConstructor>(target: T) => {
        const gameClass = class QhunGameImpl extends (Injectable()(target) as T) { };
        const gameInstance: any = new gameClass();

        // exposing instance?
        if (options.exposeGameInstance) {
            (window as any).game = gameInstance;
        }

        // print powered by
        poweredBy.forEach(line => {
            console.log(`%c${line.text}`, line.style.join(" "));
        });

        return gameClass;
    });
}
