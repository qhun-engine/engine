import { Injectable } from "../di/Injectable";
import { ResourceLoader } from "./ResourceLoader";
import { SoundResource } from "./sound/SoundResource";
import { TextResource } from "./text/TextResource";
import { ClassConstructor } from "../constraint/ClassConstructor";
import { ResourceOptions } from "./ResourceRequestOptions";

/**
 * The resource manager stores resources, group resources and load resources when
 * the game needs them
 */
@Injectable()
export class ResourceManager {

    constructor(
        private resourceLoader: ResourceLoader
    ) { }

    /**
     * load the given soundfile into the game
     * @param url the url of the sound file
     * @param resource optionally a resource class
     * @param options optional options for the request
     */
    public async loadSound<T extends SoundResource>(
        url: string,
        resource: ClassConstructor<T> = SoundResource as ClassConstructor<T>,
        options?: ResourceOptions
    ): Promise<T> {

        return this.resourceLoader.loadResource<T>(url, resource, Object.assign(options || {}, {
            type: "arraybuffer"
        }));
    }

    /**
     * load the given text resource into the game
     * @param url the url of the text resource
     * @param resource optionally a resource class
     * @param options optional options for the request
     */
    public async loadText<T extends TextResource>(
        url: string,
        resource: ClassConstructor<T> = TextResource as ClassConstructor<T>,
        options?: ResourceOptions
    ): Promise<T> {

        return this.resourceLoader.loadResource<T>(url, resource, Object.assign(options || {}, {
            type: "text"
        }));
    }
}
