import { Resource } from "./Resource";

/**
 * The base class for all in game resources
 */
export abstract class BaseResource<T = any> implements Resource<T> {

    /**
     * the data of the resource
     */
    protected data!: T;

    constructor(
        protected requestUrl: string,
        protected responseUrl: string
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

    /**
     * get the url where the resource was requested from
     */
    public getRequestUrl(): string {

        return this.requestUrl;
    }

    /**
     * get the full response url for this resource
     */
    public getResponseUrl(): string {

        return this.responseUrl;
    }

    /**
     * @inheritdoc
     */
    public process?(data: any, ...args: any[]): Promise<T>;
}
