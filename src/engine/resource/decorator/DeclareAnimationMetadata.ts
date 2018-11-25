import { SpriteResource } from "../sprite/SpriteResource";

export interface DeclareAnimationMetadata {

    /**
     * the sprite resource of the declaration process
     */
    sprite?: SpriteResource;

    /**
     * the spritesheet image url
     */
    image: string;

    /**
     * the animation data url
     */
    animation: string;

    /**
     * the animation name
     */
    name: string;

    /**
     * animation speed
     */
    fps: number;

}
