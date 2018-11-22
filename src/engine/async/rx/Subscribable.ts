import { Observer } from "./Observer";
import { Unsubscribable } from "./Unsubscribable";

export interface Subscribable<T> {

    subscribe(observer?: Observer<T>): Unsubscribable;
    subscribe(next?: (data: T) => void, error?: (error: T | Error) => void, complete?: () => void): Unsubscribable;
}
