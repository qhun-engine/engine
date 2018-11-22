import { Subject } from "./Subject";

export class BehaviourSubject<T> extends Subject<T> {

    constructor(
        private value: T
    ) { super(); }

    public getValue(): T {
        if (!this.active) {
            throw new Error("Obserable isnt active any more!");
        }
        return this.value;

    }

    public next(value: T): void {
        super.next(this.value = value);
    }
}
