// tslint:disable member-ordering

import { Subscriber } from "./Subscriber";
import { Unsubscribable } from "./Unsubscribable";
import { Subscribable } from "./Subscribable";
import { Subscription } from "./Subscription";
import { Observer } from "./Observer";

export class Observable<T> implements Subscribable<T> {

    private internalSubscribe: (this: Observable<T>, subscriber: Subscriber<T>) => Unsubscribable;

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

    public subscribe(
        observer: Observer<T> | ((data: T) => void),
        error?: (error: T | Error) => void,
        complete?: () => void
    ): Subscription {

        const subscriber = new Subscriber(observer, error, complete);
        this.internalSubscribe(subscriber);
        return subscriber;
    }

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
