import { ClassConstructor, Singleton } from "@qhun-engine/base";

import { Resource } from "./Resource";
import { ResourceOptions } from "./ResourceRequestOptions";

/**
 * Is responsable for loading resources from sync or async sources
 */
@Singleton()
export class ResourceLoaderUtility {

    /**
     * loads a resource from a sync or async source. a synchronous source will result in an immediately resolved promise
     * @param url the url to load the resource from
     * @param resource the resource constructor
     * @param type the type of the resource
     */
    public async loadResource<R extends Resource = Resource>(
        url: string,
        resource: ClassConstructor<R>,
        options: ResourceOptions<R> = {
            ignoreCache: false,
            type: "text"
        }
    ): Promise<R> {

        // wrap with a promise
        return new Promise<R>((resolve, reject) => {

            try {

                // apply default option values
                options.ignoreCache = typeof options.ignoreCache === "boolean" ? options.ignoreCache : false;
                options.type = typeof options.type === "string" ? options.type : "text";

                // construct a xhr request
                const request = new XMLHttpRequest();
                request.open("GET", `${url}${options.ignoreCache ? this.getIgnoreCacheSuffix(url) : ""}`);
                request.responseType = options.type;

                // handle errors
                request.onerror = reject;

                // handle load event
                request.onload = () => {

                    try {

                        // check status, must be 0 or 200 like
                        if (request.status === 0 || (request.status >= 200 && request.status <= 299)) {

                            // check for a valid response
                            const response = request.response;
                            if (response) {

                                // parse response
                                this.getResourceFromHttpResponse([url, request.responseURL], response, resource, options).then(ri => resolve(ri), reject);
                                return;
                            } else {

                                reject(`Server answered with status ${request.status} (${request.statusText}) but there is no payload to continue with.`);
                            }
                        }

                        // tslint:disable-next-line max-line-length
                        reject(`Server did not respond with a good status code. Status code was ${request.status} (${request.statusText}). No resource data available`);

                    } catch (e) {

                        reject(e);
                    }
                };

                // finally send the http request
                request.send();

            } catch (e) {

                reject(e);
            }
        });
    }

    /**
     * get the actual resource from the http response
     * @param requestResponseUrl the request and response url of the resource
     * @param httpResponse the current http response object
     * @param resource the resource to construct
     * @param options the resoruce options
     */
    private async getResourceFromHttpResponse<R extends Resource = Resource>(
        requestResponseUrl: [string, string],
        httpResponse: any,
        resource: ClassConstructor<R>,
        options: ResourceOptions<R>
    ): Promise<R> {

        // build the resource
        const resourceInstance = new resource(requestResponseUrl[0], requestResponseUrl[1]);

        // check for before process callback
        if (options.beforeProcessCallback && typeof options.beforeProcessCallback === "function") {

            // execute that callback
            options.beforeProcessCallback(resourceInstance);
        }

        // check if data should be processed
        if (typeof resourceInstance.process === "function") {
            httpResponse = await resourceInstance.process(httpResponse);
        }

        // set content
        resourceInstance.setData(httpResponse);

        return resourceInstance;
    }

    /**
     * builds the ignore cache suffix
     */
    private getIgnoreCacheSuffix(url: string): string {

        // if the current url contains query string params, append with &
        // otherwise append with ?
        const appendChar = /\?\w*=\w*/.test(url) ? "&" : "?";

        // use current date as nonce
        return `${appendChar}__ignoreCache=${new Date().getTime()}`;
    }

}
