import { ClassConstructor } from "@qhun-engine/base";

/**
 * executes the given callback function when an instance of the class is constructed
 * @param callback the callback function to execute
 */
export function AfterConstructionHook(callback: (instantiatedClass: any) => void): ClassDecorator {

    // tslint:disable-next-line ban-types
    return <ClassDecorator>((target: ClassConstructor) => {

        return class AfterConstructionHookImpl extends target {

            constructor(...args: any[]) {
                super(...args);

                // execute the callback
                callback(this);
            }
        };
    });
}
