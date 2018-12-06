import { Injector } from "@qhun-engine/base";
import { ThreadFactory } from "./ThreadFactory";

// tslint:disable jsdoc-format
/**
 * declares this function to run on a seperate thread of the cpu. Please not that you can not use
 * the normal environmental information like window or document objects!
 * @experimental You can not use any objects outside of this function context and you can only transfer
 * arguments that are simple in its structure like primitive data types or data access objects.
 * @example
```
class Test {
    @Threaded()
    private async xmlTest(x: number): Promise<any> {

        const fibonacci = (num: number) => {
            let result = 0;
            if (num < 2) {
                result = num;
            } else {
                result = fibonacci(num - 1) + fibonacci(num - 2);
            }
            return result;
        };
        return fibonacci(x);
    }
}
```
 */
export function Threaded(): MethodDecorator {

    return <T>(target: object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => {

        // get the thread factory to create a thread
        return Injector.getInstance().instantiateClass(ThreadFactory)
            // overwrite the existing descriptor that invokes the thread creating and talking
            .createFromDescriptor(descriptor);
    };
}
