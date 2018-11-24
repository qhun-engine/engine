import { ClassConstructor } from "../constraint/ClassConstructor";
import { Injector } from "./Injector";
import "reflect-metadata";

/**
 * a property and parameter decorator to inject the given class into this property when this property
 * is requested
 * @param dependency the target class you want to inject
 */
export function Inject(dependency?: ClassConstructor): PropertyDecorator & ParameterDecorator {

    return <T extends { [index: string]: any }>(target: T, propertyKey: string | symbol, parameterIndex?: number) => {

        // get the type of the dependency
        if (!dependency) {

            // resolve the type
            const token = Reflect.getMetadata("design:type", target, propertyKey);

            if (!token) {
                const key = propertyKey.toString();
                throw new Error(
                    `No type metadata for ${key} on ${target.constructor.name} found. Please add a type or provide a class via decorator parameter.`
                );
            }

            // cast to class constructor
            dependency = token as ClassConstructor;
        }

        // get the injector
        const injector = Injector.getInstance();

        // property decorator logic
        if (parameterIndex === undefined) {

            // set property value via injector
            target[propertyKey as keyof T] = injector.instantiateClass(dependency);
        }

    };
}
