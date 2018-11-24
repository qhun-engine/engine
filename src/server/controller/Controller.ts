import { ClassConstructor } from "../../engine/constraint/ClassConstructor";
import { Injectable } from "../../engine/di/Injectable";
import "reflect-metadata";

export const controllerMetadataKey = "engine:controller:prefix";

export declare type ControllerMetadataStructure = {
    prefix: string,
    name: string
};

/**
 * A class level decorator to tell the router that this class is a controller that can handle
 * api requests with some of its functions. A `@Controller` class will be `@Injectable` and  `@Singleton`
 * @param prefixPath the prefix path for all `@RequestMapping` methods
 */
export function Controller(prefixPath: string): ClassDecorator {

    return <ClassDecorator>((target: ClassConstructor) => {

        // register prefix for controller via reflection
        Reflect.defineMetadata(controllerMetadataKey, {
            name: target.name,
            prefix: prefixPath
        } as ControllerMetadataStructure, target);

        // return class impl that extends the injectable class
        return class ControllerImpl extends (Injectable()(target) as ClassConstructor) { };
    });
}
