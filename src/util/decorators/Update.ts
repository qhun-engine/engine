import { Injector, MetadataRegistryService, ReflectionMetadata } from "@qhun-engine/base";
import { Engine } from "../../Engine";

/**
 * a method level decorator to tell the renderer that this method should be called during game loop at update stage
 */
export function Update(): MethodDecorator {

    return <MethodDecorator>(<T>(target: T, propertyKey: keyof T, descriptor: TypedPropertyDescriptor<T>) => {

        // await class construction
        const subscription = MetadataRegistryService.getInstance().observe<T>()
            .filter(data => data[0] === target.constructor && data[1] === ReflectionMetadata.SingletonInstance)
            .subscribe(data => {

                // unsubscribe
                subscription.unsubscribe();

                // register life cycle hook
                const injector = Injector.getInstance();
                injector.instantiateClass(Engine).addLifeCycleHook("update", (...args: any[]) => {
                    (data[2][propertyKey] as any)(...args);
                });
            });
    });
}
