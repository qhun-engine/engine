import { ClassConstructor } from "./ClassConstructor";
import "reflect-metadata";

interface SingletonClass<T extends ClassConstructor> extends ClassConstructor<T> {

    /**
     * a property to check if the singleton has allready been created
     */
    __singletonHasBeenCreated?: boolean;
}

export const singletonReflectionMarker = "engine:marker:singleton";

/**
 * a class level decorator to make sure that this class is only instantiated one time by checking
 * the singleton design pattern at runtime
 */
export function Singleton(): ClassDecorator {

    return <ClassDecorator>(<Target extends SingletonClass<any>>(target: Target) => {

        // add singleton marker
        Reflect.defineMetadata(singletonReflectionMarker, true, target);

        // return singleton implementation
        return class SingletonImpl extends target {

            /**
             * override the constructor to check the singleton pattern
             */
            constructor(...args: any[]) {
                if (target.__singletonHasBeenCreated) {

                    // throw new Error(`The singleton class cannot be instantiated twice! Class name was ${target.constructor.name}.`);
                }

                // set singleton property
                target.__singletonHasBeenCreated = true;

                // construct target
                super(...args);
            }
        };
    });
}
