import { ClassConstructor } from "../constraint/ClassConstructor";
import { ReflectionMetadata } from "../constraint/ReflectionMetadata";
import { Observable, Observer, Subscription } from "../async/rx";
import "reflect-metadata";

export class Injector {

    private static instance: Injector;
    private readonly parameterTypeReflection: string = "design:paramtypes";

    /**
     * the message observable
     */
    private injectionObserver!: Observer<object>;
    private injectionObservable = new Observable<object>(observer => {

        // save observer
        this.injectionObserver = observer;

        // dispatch every injection
        this.dispatchInjectionQueue();

        return new Subscription();
    });

    /**
     * all injections that took place before observable was ready
     */
    private injectionQueue: object[] = [];

    /**
     * the internal injector cache for storing singleton instances
     */
    private cache: {
        [id: string]: object
    } = {};

    /**
     * get the injector instance
     */
    public static getInstance(): Injector {

        if (!Injector.instance) {
            Injector.instance = new Injector();
        }

        return Injector.instance;
    }

    /**
     * get an observable for injected classes that where instantiated
     */
    public onInjection(): Observable<object> {

        return this.injectionObservable;
    }

    /**
     * instantiates the given class and resolves all constructor dependencies
     * @param target the class to instantiate
     */
    public instantiateClass<T extends object>(target: ClassConstructor<T>): T {

        // check if this target has been cached
        const cached = this.getFromCache(target);
        if (cached) {
            return cached;
        }

        // use the reflect metadata api to get the types
        const tokens = this.resolve(target);

        // resolve injections for the target class
        const injections = tokens.map(token => this.instantiateClass(token));

        // construct the target with instantiated dependencies
        const instance = new target(...injections);

        // check if this instance should be stored
        if (Reflect.getMetadata(ReflectionMetadata.Singleton, target)) {

            // add to cache
            this.addToCache(target, instance);
        }

        // next observable
        if (this.injectionObserver) {
            console.log("NEXT", instance);
            this.injectionObserver.next(instance);
        } else {
            this.injectionQueue.push(instance);
        }

        // finally return the instance
        return instance;
    }

    /**
     * resolves all constructor dependency types of the given class
     * @param target the class that should be resolved
     */
    public resolve(target: ClassConstructor): any[] {

        return Reflect.getMetadata(this.parameterTypeReflection, target) || [];
    }

    /**
     * get the given target from the cache
     * @param target the target to get from the cache
     */
    private getFromCache<T extends object>(target: ClassConstructor<T>): T | undefined {

        return this.cache[this.getCacheIndex(target)] as T;
    }

    /**
     * add the given instance to the cache
     * @param target the constructor
     * @param instance the instance
     */
    private addToCache<T extends object>(target: ClassConstructor<T>, instance: T): void {

        this.cache[this.getCacheIndex(target)] = instance;
    }

    /**
     * get a unique index for the given constructor for the caching storage
     * @param target the target to get the index for
     */
    private getCacheIndex(target: ClassConstructor): string {

        return Reflect.getMetadata(ReflectionMetadata.Injectable, target);
    }

    /**
     * dispatch injections to the observable when ready
     */
    private dispatchInjectionQueue(): void {

        this.injectionQueue.forEach(injection => {
            this.injectionObserver.next(injection);
        });

        // queue is not nessesary anymore
        delete this.injectionQueue;
    }

}
