import { Injectable } from "../di/Injectable";
import { SoundResource } from "./sound/SoundResource";
import { TextResource } from "./text/TextResource";
import { ResourceOptions } from "./ResourceRequestOptions";
import { SpriteResource } from "./sprite/SpriteResource";
import { ImageResource } from "./sprite/ImageResource";
import { JsonTextResource } from "./text/JsonTextResource";
import { SpriteAnimation } from "./sprite/SpriteAnimation";
import { ClassConstructor } from "../constraint/ClassConstructor";
import { ReflectionMetadata } from "../constraint/ReflectionMetadata";
import { Engine } from "../Engine";
import { ResourceLoaderUtility } from "./ResourceLoaderUtility";
import { Resource } from "./Resource";
import { ResourceManager } from "./ResourceManager";

/**
 * The resource loader uses a declarative loading system. Declare your game resources here
 * and the loader will load them in the game asset loading phase.
 */
@Injectable()
export class ResourceLoader {

    /**
     * the loader utility class
     */
    private loaderUtil: ResourceLoaderUtility;

    constructor(
        private resourceManager: ResourceManager
    ) {

        // construct the loader util
        this.loaderUtil = new ResourceLoaderUtility();
    }

    /**
     * declare your game assets to load them when the engine enters the asset loading phase
     * @param loader the loader function
     * @param params the paramters of the loader function
     */
    public declare<F extends (...args: any[]) => Promise<Resource>>(loader: F, ...params: Parameters<F>): ReturnType<F> {

        // add to declaration
        return new Promise<ReturnType<F>>((resolve, reject) => {
            this.resourceManager.addDeclaredResourceLoader({
                resolve, reject,
                loader: loader.bind(this, ...params)
            });
        }) as ReturnType<F>;
    }

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

        return this.loaderUtil.loadResource<T>(url, resource, Object.assign(options || {}, {
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

        return this.loaderUtil.loadResource<T>(url, resource, Object.assign(options || {}, {
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

        return this.loaderUtil.loadResource<T>(url, resource, Object.assign(options || {}, {
            type: "blob"
        }));
    }

    /**
     * load the given sprite resource into the game
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
