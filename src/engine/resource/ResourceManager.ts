import { Injectable } from "../di/Injectable";
import { ResourceLoader } from "./ResourceLoader";
import { SoundResource } from "./sound/SoundResource";
import { TextResource } from "./text/TextResource";
import { ResourceOptions } from "./ResourceRequestOptions";
import { SpriteResource } from "./sprite/SpriteResource";
import { ImageResource } from "./sprite/ImageResource";
import { JsonTextResource } from "./text/JsonTextResource";
import { SpriteAnimation } from "./sprite/SpriteAnimation";
import { ClassConstructor } from "../constraint/ClassConstructor";

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
    public async loadText<T extends TextResource<any>>(
        url: string,
        resource: ClassConstructor<T> = TextResource as ClassConstructor<T>,
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
        resource: ClassConstructor<T> = ImageResource as ClassConstructor<T>,
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
        resource: ClassConstructor<T> = SpriteResource as ClassConstructor<T>,
        options?: ResourceOptions
    ): Promise<T> {

        // load image and json data
        return Promise.all([
            this.loadImage(imageUrl, resource, options),
            this.loadText<JsonTextResource<SpriteAnimation>>(animationDataUrl, JsonTextResource, options)
        ]).then(async (result) => {

            // add animation data
            result[0].setAnimationData(result[1].getData());

            // extract sprite data
            await result[0].prepareSpriteAnimationImages();

            // return complete sprite
            return result[0];
        });
    }

}
