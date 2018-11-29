import { ClassConstructor } from "../constraint/ClassConstructor";
import { ReflectionMetadata } from "../constraint/ReflectionMetadata";
import "reflect-metadata";
import { Observer, Observable, Subscription } from "../async/rx";

export class MetadataRegistryService {

    /**
     * the private instance
     */
    private static instance: MetadataRegistryService;

    /**
     * the metadata observable
     */
    private metadataObserver!: Observer<[ClassConstructor, string, any]>;
    private metadataObservable = new Observable<[ClassConstructor, string, any]>(observer => {
        this.metadataObserver = observer;

        // dispatch all activity from the queue
        this.dispatchMetadataQueue();

        return new Subscription();
    });

    /**
     * all metadata activity that took place before observable was ready
     */
    private metadataQueue: [ClassConstructor, string, any][] = [];

    /**
     * get the instance
     */
    public static getInstance(): MetadataRegistryService {

        if (!MetadataRegistryService.instance) {
            MetadataRegistryService.instance = new MetadataRegistryService();
        }

        return MetadataRegistryService.instance;
    }

    /**
     * observe the metadata adding
     */
    public observe<V = any>(): Observable<[ClassConstructor, string, V]> {

        return this.metadataObservable;
    }

    /**
     * adds the given value to a stack on the given target using the given metadata key. if the unit exists, it will not be added again
     * @param metadataKey the metadata key from the `ReflectionMetadata` enum
     * @param target the target class
     * @param value the value to add
     */
    public addToUniqueObjectStack(metadataKey: ReflectionMetadata, target: ClassConstructor, value: any): void {

        // get the current stack
        const currentStack: any[] = Reflect.getMetadata(metadataKey, target);

        // check for the index
        if (currentStack.indexOf(value) === -1) {

            // add the value, it does not exist on the stack
            currentStack.push(value);

            // save metadata
            Reflect.defineMetadata(metadataKey, currentStack, target);

            // next observable
            if (this.metadataObserver) {
                this.metadataObserver.next([target, metadataKey, value]);
            } else {
                this.metadataQueue.push([target, metadataKey, value]);
            }
        }
    }

    /**
     * set the new value or overwrite the existing value on the target using the given key
     * @param metadataKey the metadata key from the `ReflectionMetadata` enum
     * @param target the target class
     * @param value the value to add/overwrite
     */
    public setValue(metadataKey: ReflectionMetadata, target: ClassConstructor, value: any): void {

        // just define/overwrite
        Reflect.defineMetadata(metadataKey, value, target);

        // next observable
        if (this.metadataObserver) {
            this.metadataObserver.next([target, metadataKey, value]);
        } else {
            this.metadataQueue.push([target, metadataKey, value]);
        }
    }

    /**
     * check if a value exists on the given target using the given key
     * @param metadataKey the metadata key from the `ReflectionMetadata` enum
     * @param target the target class
     */
    public exists(metadataKey: ReflectionMetadata, target: ClassConstructor): boolean {

        return Reflect.getMetadata(metadataKey, target) !== undefined;
    }

    /**
     * get the defined metadata value on the given target using the given key
     * @param metadataKey the metadata key from the `ReflectionMetadata` enum
     * @param target the target class
     */
    public get(metadataKey: ReflectionMetadata, target: ClassConstructor): any {

        return Reflect.getMetadata(metadataKey, target);
    }

    /**
     * check if the given value is on the metadata of the given target using the given key
     * @param metadataKey the metadata key from the `ReflectionMetadata` enum
     * @param target the target class
     * @param value the value to check for
     */
    public isOnStack(metadataKey: ReflectionMetadata, target: ClassConstructor, value: any): boolean {

        // get the current stack
        const currentStack: any[] = Reflect.getMetadata(metadataKey, target);

        // make the test
        return currentStack.indexOf(value) === -1;
    }

    /**
     * get the parameters declared on the given method
     * @param target the target object
     * @param method the method name or symbol
     */
    public getMethodParameters(target: object, method: string | symbol): any[] {

        const parameters = Reflect.getMetadata("design:paramtypes", target, method) || [];
        console.log(parameters);
        return parameters;
    }

    /**
     * dispatch metadata activity to the observable when ready
     */
    private dispatchMetadataQueue(): void {

        this.metadataQueue.forEach(data => {
            this.metadataObserver.next(data);
        });

        // queue is not nessesary anymore
        delete this.metadataQueue;
    }
}
