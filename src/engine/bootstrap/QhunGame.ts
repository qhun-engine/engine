import { ClassConstructor } from "../constraint/ClassConstructor";
import { Injectable } from "../di/Injectable";

/**
 * The entry point of your game where the magic happens. Put this decorator onto your main class
 * @param options @todo write options
 */
export function QhunGame(options?: any): ClassDecorator {

    return <ClassDecorator>(<T extends ClassConstructor>(target: T) => {
        return class QhunGameImpl extends (Injectable()(target) as T) { };
    });
}
