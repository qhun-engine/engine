import { RenderableEntity } from "./RenderableEntity";
import { SpriteResource } from "../resource/sprite/SpriteResource";
import { AnimationStateControl } from "../animation/AnimationStateControl";

/**
 * an entity that can have animations
 */
export interface AnimationableEntity<S = string> extends RenderableEntity {

    /**
     * add the given animation to the entity using the given name
     * @param animationName the unique name for this animation
     * @param sprite the animation sprite file
     */
    addAnimation(animationName: S, sprite: SpriteResource): ThisType<AnimationableEntity<S>>;

    /**
     * plays the given animation on the entity
     * @param animationName the name of the animation to play
     */
    playAnimation(animationName: S): AnimationStateControl;

    /**
     * stop all animations on this entity
     */
    stopAnimation(): void;
}
