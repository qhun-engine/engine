import { BaseResource } from "../BaseResource";
import { SpriteAnimation } from "./SpriteAnimation";

export class SpriteResource<T = any> extends BaseResource<T> {

    /**
     * the animation data for this sprite
     */
    protected animation!: SpriteAnimation;

    /**
     * set the animation data for this sprite
     * @param animation the animation data
     */
    public setAnimationData(animation: SpriteAnimation): this {

        this.animation = animation;
        return this;
    }
}
