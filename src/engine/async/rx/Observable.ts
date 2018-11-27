// tslint:disable member-ordering

import { Subscriber } from "./Subscriber";
import { Unsubscribable } from "./Unsubscribable";
import { Subscribable } from "./Subscribable";
import { Subscription } from "./Subscription";
import { Observer } from "./Observer";

/**
 * The observable is like a `Promise` with multiple resolves over a certain amount of time.
 * You can observe a state and get change notifications, can query wich changes should pass and
 * call whatever function you like on the result of the event stream
 */
export class Observable<T> implements Subscribable<T> {

    private internalSubscribe!: (this: Observable<T>, subscriber: Subscriber<T>) => Unsubscribable;

    constructor(subscribe: (this: Observable<T>, subscriber: Subscriber<T>) => Unsubscribable) {

        if (subscribe) {
            this.internalSubscribe = subscribe;
        }
    }

    public static fromArray<T extends any>(arrayData: T[]): Observable<T> {

        return new Observable<T>(subscriber => {
            arrayData.forEach(data => subscriber.next(data));
            subscriber.complete();
            return new Subscription(() => {
                // noop
            });
        });
    }

    /**
     * subscribe to the given `Observable` and pass your observer function to receive updates
     * @param observer the observer or callback function with the next data
     * @param error callback function for error cases
     * @param complete callback function if the observer has marked the event stream as beeing complete
     */
    public subscribe(
        observer: Observer<T> | ((data: T) => void) | undefined,
        error?: (error: T | Error) => void,
        complete?: () => void
    ): Subscription {

        if (!observer) {
            observer = () => {
                /* noop */
            };
        }

        const subscriber = new Subscriber(observer, error, complete);
        this.internalSubscribe(subscriber);
        return subscriber;
    }

    /**
     * filter next results out of your data stream with the given predicate function
     * @param predicate the predicate function
     */
    public filter(predicate: (data: T) => boolean): Observable<T> {

        const inObservable = this;
        const outObservable = new Observable<T>(outObserver => {

            const inObserver: Observer<T> = {
                next: data => {
                    let passed: boolean = false;
                    try {
                        passed = predicate(data);
                    } catch (e) {
                        outObserver.error(e);
                        return;
                    }
                    if (passed) {
                        outObserver.next(data);
                    }
                },
                error: err => outObserver.error(err),
                complete: () => outObserver.complete()
            };
            return inObservable.subscribe(inObserver);
        });
        return outObservable;
    }

    /**
     * Observes the event stream as long as your given notifier observable is not complete or errored
     * @param notifier the notifier observable
     */
    public takeUntil(notifier: Observable<T>): Observable<T> {

        const inObservable = this;
        const outObservable = new Observable<T>(outObserver => {

            const inObserver: Observer<T> = {
                next: data => outObserver.next(data),
                error: err => outObserver.error(err),
                complete: () => outObserver.complete()
            };
            return inObservable.subscribe(inObserver);
        });
        return outObservable;
    }
}
