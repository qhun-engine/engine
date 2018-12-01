import { ClassConstructor } from "../constraint/ClassConstructor";
import { Injector } from "./Injector";
import "reflect-metadata";

/**
 * a property and parameter decorator to inject the given class into this property when this property
 * is requested
 * @param dependency the target class you want to inject
 */
export function Inject(...dependencies: ClassConstructor[]): MethodDecorator & PropertyDecorator {

    return <T extends { [index: string]: any }>(target: object, propertyKey: string | symbol, descriptor?: TypedPropertyDescriptor<T>) => {

        // get the type of the dependency if it is a property decorator
        if (dependencies.length === 0 && !descriptor) {

            // resolve the type
            const token = Reflect.getMetadata("design:type", target, propertyKey);

            if (!token) {
                const key = propertyKey.toString();
                throw new Error(
                    `No type metadata for ${key} on ${target.constructor.name} found. Please add a type or provide a class via decorator parameter.`
                );
            }

            // cast to class constructor
            dependencies.push(token as ClassConstructor);
        }

        // get the injector
        const injector = Injector.getInstance();
        const resolvedDependencies = dependencies.filter(token => !!token).map(token => injector.instantiateClass(token));

        // test for property decorator first
        if (!descriptor) {

            // set the property on the target
            (target as T)[propertyKey as keyof T] = resolvedDependencies.length === 1 ? resolvedDependencies[0] : resolvedDependencies;

        } else {

            // must be method decorator
            // change descriptor to get the injected parameters
            const origDescriptor = descriptor.value as T;

            // replace descriptor
            // tslint:disable-next-line
            descriptor.value = (function (this: object, ...args: any[]) {

                // add given arguments to resolved dependencies
                resolvedDependencies.unshift(...args);

                // call original function
                // tslint:disable-next-line
                return (origDescriptor as any as Function).apply(this, resolvedDependencies);

            }) as any;

            // return the new descriptor
            return descriptor;
        }
    };

}
