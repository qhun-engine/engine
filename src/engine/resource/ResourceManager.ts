import { Injectable } from "../di/Injectable";
import { ResourceLoader } from "./ResourceLoader";
import { SoundResource } from "./sound/SoundResource";
import { TextResource } from "./text/TextResource";
import { ResourceOptions } from "./ResourceRequestOptions";
import { SpriteResource } from "./sprite/SpriteResource";
import { ImageResource } from "./sprite/ImageResource";
import { JsonTextResource } from "./text/JsonTextResource";
import { ResourceConstructor } from "./ResourceConstructor";
import { SpriteAnimation } from "./sprite/SpriteAnimation";

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
        resource: ResourceConstructor<T> = SoundResource as ResourceConstructor<T>,
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
    public async loadText<T extends TextResource<any>>(
        url: string,
        resource: ResourceConstructor<T> = TextResource as ResourceConstructor<T>,
        options?: ResourceOptions
    ): Promise<T> {

        return this.resourceLoader.loadResource<T>(url, resource, Object.assign(options || {}, {
            type: "text"
        }));
    }

    /**
     * load the given text resource into the game
     * @param url the url of the image resource
     * @param resource optionally a resource class
     * @param options optional options for the request
     */
    public async loadImage<T extends ImageResource>(
        url: string,
        resource: ResourceConstructor<T> = ImageResource as ResourceConstructor<T>,
        options?: ResourceOptions
    ): Promise<T> {

        return this.resourceLoader.loadResource<T>(url, resource, Object.assign(options || {}, {
            type: "blob"
        }));
    }

    /**
     * load the given text resource into the game
     * @param imageUrl the url of the image
     * @param animationDataUrl the url of the animation data
     * @param resource optionally a resource class
     * @param options optional options for the request
     */
    public async loadSprite<T extends SpriteResource>(
        imageUrl: string,
        animationDataUrl: string,
        resource: ResourceConstructor<T> = SpriteResource as ResourceConstructor<T>,
        options?: ResourceOptions
    ): Promise<T> {

        // load image and json data
        return Promise.all([
            this.loadImage(imageUrl, ImageResource, options),
            this.loadText<JsonTextResource<SpriteAnimation>>(animationDataUrl, JsonTextResource, options)
        ]).then(result => {

            const resourceInstance = new resource(result[0].getData());
            resourceInstance.setAnimationData(result[1].getData());

            return resourceInstance;
        });
    }

}
