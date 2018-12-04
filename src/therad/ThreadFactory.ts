import { Injectable } from "@qhun-engine/base";

import { Thread } from "./Thread";

/**
 * can create threads based on different sources
 */
@Injectable()
export class ThreadFactory {

    /**
     * creates a thread from a method descriptor.
     * @param descriptor the descriptor of the method
     * @returns a new descriptor that implements the nessesary thread talking
     */
    public createFromDescriptor<T>(descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> {

        // copy the original descriptor value
        const originalDescriptorValue = descriptor.value as T;

        // overwrite the descriptor
        // tslint:disable-next-line
        descriptor.value = (function (this: object, ...args: any[]) {

            // get function parameter names
            const paramNamesMatch = originalDescriptorValue.toString().match(/^\w+\W?\(([\w-,\ \$]+)\)/) || ["", ""] as RegExpMatchArray;

            // get rid of the match phrase
            paramNamesMatch.splice(0, 1);

            // get the raw source code
            const fktnName = "xmlTest";

            const src = [
                "function ",
                originalDescriptorValue.toString(),
                `return ${fktnName}(${paramNamesMatch.join(",")}).next().value`
            ];

            // create the thread
            const thread = new Thread(src.join("\n"), paramNamesMatch);

            // start the thread and get the promise
            const promise = thread.start();

            // send arguments
            thread.setArguments({}, ...args);

            // return that promise
            return promise;

        }) as any;

        // return the new descriptor that can invoke threads
        return descriptor;
    }
}
