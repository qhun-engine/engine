import { Resource } from "./Resource";
import { Injectable } from "../di/Injectable";
import { ClassConstructor } from "../constraint/ClassConstructor";
import { ResourceOptions } from "./ResourceRequestOptions";

/**
 * Is responsable for loading resources from sync or async sources
 */
@Injectable()
export class ResourceLoader {

    /**
     * loads a resource from a sync or async source. a synchronous source will result in an immediately resolved promise
     * @param url the url to load the resource from
     * @param resource the resource constructor
     * @param type the type of the resource
     */
    public async loadResource<R extends Resource = Resource>(
        url: string,
        resource: ClassConstructor<R>,
        options: ResourceOptions = {
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

                                const resourceInstance = this.getResourceFromHttpResponse(response, resource);
                                resolve(resourceInstance);
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
     * @param httpResponse the current http response object
     * @param resource the resource to construct
     */
    private getResourceFromHttpResponse<R extends Resource = Resource>(httpResponse: any, resource: ClassConstructor<R>): R {

        return new resource(httpResponse);
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
