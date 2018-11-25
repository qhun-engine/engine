import { Injector } from "../../di/Injector";
import { Engine } from "../../Engine";

/**
 * a method level decorator to tell the renderer that this method should be called during game loop at draw stage
 */
export function Draw(): MethodDecorator {

    return <MethodDecorator>(<T>(target: T, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) => {

        // get the engine
        const injector = Injector.getInstance();
        const subscription = injector.onInjection()
            .filter(object => object instanceof target.constructor)
            .subscribe((instObject: { [index: string]: any }) => {

                // register life cycle hook
                injector.instantiateClass(Engine).addLifeCycleHook("draw", (...args: any[]) => {
                    (instObject[propertyKey] as any)(...args);
                });

                // unsubscribe
                subscription.unsubscribe();
            });
    });
}
