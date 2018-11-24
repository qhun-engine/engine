import * as express from "express";
import { ReflectionMetadata } from "../../engine/constraint/ReflectionMetadata";

export declare type HttpMethod = Extract<keyof express.IRouter<any>, "get" | "post" | "index" | "put" | "patch" | "options" | "head">;

export declare type RequestMappingStructure = {
    [path: string]: {
        method: HttpMethod,
        handler: (...args: any[]) => any,
        methodName: string
    }
};

/**
 * A method decorator that allows to bind a http route to this function using the given path and given http method
 * @param path options for this request mapping
 */
export function RequestMapping(options: { path?: string, method?: HttpMethod } = { path: "", method: "get" }): MethodDecorator {

    // assign defaults
    options.path = options.path || "";
    options.method = options.method || "get";

    // return the method decorator function
    return <MethodDecorator>(<T extends { [index: string]: any }>(target: T, propertyKey: keyof T, descriptor: TypedPropertyDescriptor<T>) => {

        // get current reflection state
        const current: RequestMappingStructure = Reflect.getMetadata(ReflectionMetadata.RequestMapping, target) || {};

        // add this method
        current[options.path as string] = {
            method: options.method as HttpMethod,
            handler: target[propertyKey],
            methodName: propertyKey as string
        };

        // save metadata
        Reflect.defineMetadata(ReflectionMetadata.RequestMapping, current, target);
    });

}
