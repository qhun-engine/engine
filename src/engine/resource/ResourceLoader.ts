import { Injectable } from "../di/Injectable";
import { SoundResource } from "./sound/SoundResource";
import { TextResource } from "./text/TextResource";
import { ResourceOptions } from "./ResourceRequestOptions";
import { SpriteResource } from "./sprite/SpriteResource";
import { ImageResource } from "./sprite/ImageResource";
import { JsonTextResource } from "./text/JsonTextResource";
import { SpriteAnimationJson } from "./sprite/SpriteAnimationJson";
import { ClassConstructor } from "../constraint/ClassConstructor";
import { ResourceLoaderUtility } from "./ResourceLoaderUtility";
import { Resource } from "./Resource";
import { ResourceManager } from "./ResourceManager";
import { TilesetResource } from "./tileset/TilesetResource";
import { XmlTextResource } from "./text/XmlTextResource";
import { TSXTileset } from "./tileset/tiled/TSXTileset";
import { TileworldResource } from "./tileset/TileworldResource";
import { TMXTileworld } from "./tileset/tiled/TMXTileworld";
import { Loadable } from "./Loadable";

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
     * creates a loadable type that can be executed when the resource is needed
     * @param loader the loader function
     * @param params the paramters of the loader function
     */
    public createLoadable<F extends (...args: any[]) => Promise<Resource>>(loader: F, ...params: Parameters<F>): () => ReturnType<F> {

        // create a bound context for the loadable object
        return () => {

            // load the requested resource and return a promise
            return loader.apply(this, params);
        };
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
        options?: ResourceOptions<T>
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
        options?: ResourceOptions<T>
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
        options?: ResourceOptions<T>
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
        options?: ResourceOptions<T>
    ): Promise<T> {

        // load image and json data
        return Promise.all([
            this.loadImage(imageUrl, resource, options),
            this.loadText<JsonTextResource<SpriteAnimationJson>>(animationDataUrl, JsonTextResource, options as ResourceOptions<any>)
        ]).then(async (result) => {

            // add animation data
            result[0].setAnimationData(result[1].getData());

            // extract sprite data
            await result[0].prepare();

            // return complete sprite
            return result[0];
        });
    }

    /**
     * load the given tileset resource into the game
     * @param imageUrl the url of the image
     * @param animationDataUrl the url of the animation data
     * @param resource optionally a resource class
     * @param options optional options for the request
     */
    public async loadTileset<T extends TilesetResource>(
        resourceUrl: string,
        resource: ClassConstructor<T> = TilesetResource as ClassConstructor<T>,
        options?: ResourceOptions<T>
    ): Promise<T> {

        // load resource data as xml
        const xmlData = await this.loadText<XmlTextResource<TSXTileset>>(resourceUrl, XmlTextResource, options as ResourceOptions<any>);

        // construct the tileset
        const tileset = new resource(xmlData.getRequestUrl(), xmlData.getResponseUrl());

        // process the tileset data
        tileset.setData(await tileset.process(xmlData));

        // return the complete tileset
        return tileset as T;
    }

    /**
     * load the given tileworld resource into the game
     * @param imageUrl the url of the image
     * @param animationDataUrl the url of the animation data
     * @param resource optionally a resource class
     * @param options optional options for the request
     */
    public async loadTileworld<T extends TileworldResource>(
        resourceUrl: string,
        resource: ClassConstructor<T> = TileworldResource as ClassConstructor<T>,
        options?: ResourceOptions<T>
    ): Promise<T> {

        // load resource data as xml
        const xmlData = await this.loadText<XmlTextResource<TMXTileworld>>(resourceUrl, XmlTextResource, options as ResourceOptions<any>);

        // construct the tileset
        const tileworld = new resource(xmlData.getRequestUrl(), xmlData.getResponseUrl());

        // execute possible callback
        if (options && typeof options.beforeProcessCallback === "function") {
            options.beforeProcessCallback(tileworld);
        }

        // process the tileset data
        tileworld.setData(await tileworld.process(xmlData));

        // return the complete tileset
        return tileworld as T;
    }
}
