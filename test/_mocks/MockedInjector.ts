import { ClassConstructor, Injector } from "@qhun-engine/base";

export class MockedInjector implements Partial<Injector> {

    private static inst: MockedInjector;

    public static getInstance(): MockedInjector {

        if (!MockedInjector.inst) {
            MockedInjector.inst = new MockedInjector();
        }
        return MockedInjector.inst;
    }

    public static get<T extends object>(target: ClassConstructor<T>): T {

        return this.getInstance().instantiateClass(target);
    }

    /**
     * instantiates the given class and resolves all constructor dependencies
     * @param target the class to instantiate
     */
    public instantiateClass<T extends object>(target: ClassConstructor<T>): T {

        // use the reflect metadata api to get the types
        const tokens = this.resolve(target);

        // resolve injections for the target class
        const injections = tokens.map(token => this.instantiateClass(token));

        // remove singleton marker
        (target as any).__singletonHasBeenCreated = false;

        // construct the target with instantiated dependencies
        const instance = new target(...injections);

        // finally return the instance
        return instance;
    }
    /**
     * resolves all constructor dependency types of the given class
     * @param target the class that should be resolved
     */
    public resolve(target: ClassConstructor): any[] {

        return Reflect.getMetadata("design:paramtypes", target) || [];
    }
    /**
     * add the given instance to the cache
     * @param target the constructor
     * @param instance the instance
     */
    public addToCache<T extends object>(target: ClassConstructor<T>, instance: T): void {
        // noop
    }
}

// overwrite the injector
Injector.getInstance = MockedInjector.getInstance as any;
Injector.get = MockedInjector.get as any;