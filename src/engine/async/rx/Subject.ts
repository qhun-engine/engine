import { Observable } from "./Observable";
import { Subscription } from "./Subscription";
import { Unsubscribable } from "./Unsubscribable";
import { Observer } from "./Observer";

export class Subject<T> extends Observable<T> implements Unsubscribable {

    protected observers: Observer<T>[] = [];
    protected active: boolean = true;

    public next(data?: T): void {
        if (this.active) {
            this.observers.forEach(obs => obs.next(data));
        }
    }

    public error(error: T | Error): void {

        this.active = false;
        this.observers.forEach(obs => obs.error(error));
        this.observers.slice();
    }

    public complete(): void {

        if (this.active) {

            this.observers.forEach(obs => obs.complete());
        }
    }

    public unsubscribe(): void {

        this.active = false;
        this.observers.slice();
    }
}
