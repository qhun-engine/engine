import { Resource } from "./Resource";

export declare type ResourceOptions<R extends Resource> = {

    /**
     * the type of the resource
     */
    type?: XMLHttpRequestResponseType,

    /**
     * ignores http cache by appending a nonce value to the url
     */
    ignoreCache?: boolean,

    /**
     * a callback to make changes to the resource before the process function is triggered
     */
    beforeProcessCallback?: (resourceInstance: R) => void
};
