import { ResourceProtocol } from "./ResourceProtocol";

/**
 * a constraint interface for resource requesting
 */
export interface ResourceRequest {

    /**
     * the protocol that is used to get this resource
     */
    protocol: ResourceProtocol;

    /**
     * the aditional data send to the receiver of the request
     */
    requestPayload: {
        [urlKey: string]: string | number | boolean | void
    };
}
