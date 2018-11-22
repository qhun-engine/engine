export class Observer<T> {

    public next(value: T): void {
        // noop
    }

    public error(err: T | Error): void {
        throw err;
    }

    public complete(): void {
        // noop
    }
}
