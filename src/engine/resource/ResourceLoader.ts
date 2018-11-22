import { Resource } from "./Resource";
import { ResourceRequest } from "./ResourceRequest";

/**
 * Is responsable for loading resources from sync or async sources
 */
export class ResourceLoader {

    /**
     * loads a resource from a sync or async source. a synchronous source will result in an immediately resolved promise
     * @param resourceRequest the resource to load
     */
    public async loadResource<R extends ResourceRequest>(resourceRequest: R): Promise<Resource> {

        return {} as Resource;
    }

}
