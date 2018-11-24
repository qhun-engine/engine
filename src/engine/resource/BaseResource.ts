import { Resource } from "./Resource";

/**
 * The base class for all in game resources
 */
export abstract class BaseResource<T = any> implements Resource<T> {

    /**
     * @param data the resoruce data in binary form
     */
    constructor(
        protected data: T
    ) { }

    /**
     * get the raw resource data
     */
    public getData(): T {
        return this.data;
    }

    /**
     * set the resource data
     * @param data the new resource data
     */
    public setData(data: T): this {
        this.data = data;
        return this;
    }

    /**
     * Determines if the resource is currently loaded
     */
    public isLoaded(): boolean {

        return this.data !== undefined;
    }
}
