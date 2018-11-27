import { ClassConstructor } from "../constraint/ClassConstructor";
import { ReflectionMetadata } from "../constraint/ReflectionMetadata";
import "reflect-metadata";

export class MetadataRegistryService {

    /**
     * the private instance
     */
    private static instance: MetadataRegistryService;

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
}
