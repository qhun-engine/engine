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
import { ReflectionMetadata } from "../constraint/ReflectionMetadata";
import { Engine } from "../Engine";
import { DeclareAnimationMetadata } from "./decorator/DeclareAnimationMetadata";
import { TileMapResource } from "./tileset/TileMapResource";
import { TileMapMetadata } from "./tileset/TileMapMetadata";
import { TileWorldResource } from "./tileset/TileWorldResource";

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

    /**
     * load the given tilemap resource into the game
     * @param imageUrl the url of the image
     * @param tilemapMetadataUrl the url of the tilemap data
     * @param resource optionally a resource class
     * @param options optional options for the request
     */
    public async loadTileMap<T extends TileMapResource>(
        imageUrl: string,
        tilemapMetadataUrl: string,
        resource: ClassConstructor<T> = TileMapResource as ClassConstructor<T>,
        options?: ResourceOptions
    ): Promise<T> {

        // load image and json data
        return Promise.all([
            this.loadImage(imageUrl, resource, options),
            this.loadText<JsonTextResource<TileMapMetadata>>(tilemapMetadataUrl, JsonTextResource, options)
        ]).then(async (result) => {

            // add animation data
            result[0].setTileMapMetadata(result[1].getData());

            // extract sprite data
            await result[0].prepareTiles();

            // return complete sprite
            return result[0];
        });
    }

    /**
     * load the given tile world resource into the game
     * @param worldDataUrl the url of the world json data
     * @param resource optionally a resource class
     * @param options optional options for the request
     */
    public async loadTileWorld<T extends TileWorldResource>(
        worldDataUrl: string,
        resource: ClassConstructor<T> = TileWorldResource as ClassConstructor<T>,
        options?: ResourceOptions
    ): Promise<T> {

        return this.resourceLoader.loadResource<T>(worldDataUrl, resource, Object.assign(options || {}, {
            type: "text"
        }));
    }

    /**
     * load all via metadata declared resources
     * @internal
     */
    public async loadDeclaredResources(): Promise<void> {

        // get all declarations
        const declarations = Reflect.getMetadata(ReflectionMetadata.DeclareAnimationRepository, Engine) as ClassConstructor[] || [];
        const promiseLoadStack: Promise<void>[] = [];

        // iterate over these declarations
        declarations.forEach(dec => {

            // get @DeclareAnimation metadata
            const declaredAnimations: DeclareAnimationMetadata[] = Reflect.getMetadata(ReflectionMetadata.DeclareAnimation, dec) || [];

            // load the sprite resource
            declaredAnimations.forEach((anim, index) => {
                promiseLoadStack.push(this.loadSprite(anim.image, anim.animation).then(sprite => {

                    // write the sprite back to meta
                    const current = Reflect.getMetadata(ReflectionMetadata.DeclareAnimation, dec) as DeclareAnimationMetadata[];
                    current[index].sprite = sprite;
                    Reflect.defineMetadata(ReflectionMetadata.DeclareAnimationRepository, Engine, current);
                }));
            });
        });

        return Promise.all(promiseLoadStack).then(() => { /* void cast */ });
    }

}
