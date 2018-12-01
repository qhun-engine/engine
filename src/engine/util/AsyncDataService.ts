import { Injectable } from "../di/Injectable";

@Injectable()
export class AsyncDataService {

    /**
     * an array map with contextual async await keyword support
     * @param data the data to process
     * @param predicate the mapping function
     */
    public async asyncMap<T, R>(data: T[], predicate: (one: T) => Promise<R>): Promise<R[]> {

        const newStack: R[] = [];
        for (const one of data) {

            newStack.push(await predicate(one));
        }

        return newStack;
    }
}
