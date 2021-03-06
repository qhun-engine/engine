import { Inject } from "@qhun-engine/base";

import { SpriteAnimationJson } from "./SpriteAnimationJson";
import { ImageResource } from "./ImageResource";
import { SpriteImageExtractor } from "./SpriteImageExtractor";
import { NeedPreperation } from "../../constraint/NeedPreperation";

export class SpriteResource<T extends HTMLImageElement = HTMLImageElement> extends ImageResource<T> implements NeedPreperation {

    @Inject()
    private spriteImageExtractor!: SpriteImageExtractor;

    /**
     * the animation data for this sprite
     */
    protected animation!: SpriteAnimationJson;

    /**
     * contains all animation images
     */
    protected animationImages: ImageResource[] = [];

    /**
     * take the sprite sheet and animation data to extract all available
     * sub images of the sprite sheet and stores them in this object
     */
    public async prepare(): Promise<void> {

        // decouple sprite images
        const result = await this.spriteImageExtractor.extractImagesFromSpriteSheet(this);

        // save images
        this.animationImages = result.map(r => r.image);
    }

    /**
     * set the animation data for this sprite
     * @param animation the animation data
     */
    public setAnimationData(animation: SpriteAnimationJson): this {

        this.animation = animation;
        return this;
    }

    /**
     * get the animation data of the sprite
     */
    public getAnimation(): SpriteAnimationJson {

        return this.animation;
    }

    /**
     * get all animation images
     */
    public getAnimationImages(): ImageResource[] {

        return this.animationImages;
    }
}
