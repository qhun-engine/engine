import { Injector } from "../../di/Injector";
import { Engine } from "../../Engine";
import { AfterConstructionHook } from "./AfterConstructionHook";
import { MetadataRegistryService } from "../MetadataRegistryService";
import { ReflectionMetadata } from "../../constraint/ReflectionMetadata";

/**
 * a method level decorator to tell the renderer that this method should be called during game loop at draw stage
 */
export function Draw(): MethodDecorator {

    return <MethodDecorator>(<T>(target: T, propertyKey: keyof T, descriptor: TypedPropertyDescriptor<T>) => {

        // await class construction
        const subscription = MetadataRegistryService.getInstance().observe<T>()
            .filter(data => data[0] === target.constructor && data[1] === ReflectionMetadata.SingletonInstance)
            .subscribe(data => {

                // unsubscribe
                subscription.unsubscribe();

                // register life cycle hook
                const injector = Injector.getInstance();
                injector.instantiateClass(Engine).addLifeCycleHook("draw", (...args: any[]) => {
                    (data[2][propertyKey] as any)(...args);
                });
            });
    });
}
