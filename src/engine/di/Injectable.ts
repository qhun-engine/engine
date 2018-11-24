import { InjectableOptions } from "./InjectableOptions";
import { ClassConstructor } from "../constraint/ClassConstructor";
import { Singleton } from "../constraint/Singleton";
import { Injector } from "./Injector";
import { ReflectionMetadata } from "../constraint/ReflectionMetadata";
import "reflect-metadata";

/**
 * a class level decorator to tell the injection system that this class is
 * injectable via dependency injection.
 * @param options the options for this injectable class
 */
export function Injectable(options: InjectableOptions = { singleton: true }): ClassDecorator {

    return <ClassDecorator>(<Target extends object>(target: ClassConstructor<Target>) => {

        // should this class be a singleton?
        let originClass: ClassConstructor = target;
        if (options.singleton) {
            originClass = Singleton()(target) as ClassConstructor;
        }

        // add reflection class id
        Reflect.defineMetadata(ReflectionMetadata.Injectable, Math.random().toString(36).substr(2, 9), target);

        // get the injector
        const injector = Injector.getInstance();

        return class InjectableImpl extends originClass {

            /**
             * override the constructor to perform dependency injection
             */
            constructor() {

                /**
                 * resolves all dependencies on the target using the injector
                 */
                super(...injector.resolve(target)
                    .map(token => injector.instantiateClass(token))
                );
            }
        };
    });
}
