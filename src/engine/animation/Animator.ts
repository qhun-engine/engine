import { Singleton } from "../constraint/Singleton";
import { Draw } from "../util/decorators/Draw";
import { Renderable } from "../constraint/Renderable";
import { Animation, CallbackAnimation, SpriteAnimation, isCallbackAnimation } from "./Animation";
import { SpriteResource } from "../resource/sprite/SpriteResource";
import { Transition } from "./transition/Transition";

declare type ActiveAnimation = Required<SpriteAnimation> & Required<CallbackAnimation> & {

    /**
     * metadata about the currently active animaton
     */
    __activeAnimation: {

        /**
         * animation is paused?
         */
        paused: boolean,

        /**
         * the currently visible time of the current frame/part in milliseconds
         */
        visibleTime: number,

        /**
         * the current index of the sprite animation
         */
        currentIndex: number
    };
};

/**
 * the concrete animation implemention. This class hooks into the game loop and changes the
 * animation states and textures of renderable objects
 */
@Singleton()
export class Animator {

    /**
     * all currently active animations
     */
    private activeAnimations: [Renderable, ActiveAnimation][] = [];

    /**
     * start the given animation
     * @param renderable the renderable object
     * @param animation the animation to start
     */
    public startAnimation<R extends Renderable>(renderable: R, animation: Animation<R>): void {

        // add active animation defaults
        (animation as ActiveAnimation).__activeAnimation = {
            currentIndex: -1,
            paused: false,
            visibleTime: 0
        };

        // add to animations
        this.activeAnimations.push([renderable, animation as ActiveAnimation]);
    }

    /**
     * stop the animation on the given renderable
     * @param renderable the renderable to stop the given animation on
     * @param animation the animation to start
     */
    public stopAnimation<R extends Renderable>(renderable: R, animation: Animation<R>): void {

        // remove from active animation stack
        this.activeAnimations.splice(this.activeAnimations.indexOf([renderable, animation as ActiveAnimation]));
    }

    /**
     * redraw every animation
     */
    @Draw()
    private updateAnimations(delta: number, timeDelta: number): void {

        // handle every animation in the storage
        this.activeAnimations.forEach(anim => {

            // get values from the tuple
            const data = anim[1];

            // dont go with paused animations
            if (data.__activeAnimation.paused) {
                return;
            }

            // increase the current visible time of the current animation state
            data.__activeAnimation.visibleTime += timeDelta;

            // calculate the next state of the animation
            if (isCallbackAnimation(data)) {

                return this.animateCallback(data, anim[0]);
            }

            // sprite animation left, so dot it
            this.animateSprite(data, anim[0]);
        });
    }

    /**
     * animates the given sprite animation
     * @param animation the sprite animation
     * @param renderable the renderable object
     */
    private animateSprite<R extends Renderable>(animation: Required<SpriteAnimation>, renderable: R): void {

        const activeAnimation = (animation as ActiveAnimation).__activeAnimation;

        // get current and next index
        const currentIndex = activeAnimation.currentIndex;
        const nextIndex = this.getNextAnimationIndex(animation);

        // if the index is different then show the new image
        if (nextIndex !== currentIndex) {

            // set new index
            activeAnimation.currentIndex = nextIndex;

            // show next image
            renderable.setTexture((animation.animate as SpriteResource).getAnimationImages()[nextIndex].getData());
        }

    }

    /**
     * animates the given callback animation
     * @param animation the animation data
     * @param renderable the renderable object
     */
    private animateCallback<R extends Renderable>(animation: Required<CallbackAnimation<R>>, renderable: R): void {

        // get next state
        const pct = (animation as ActiveAnimation).__activeAnimation.visibleTime / animation.time;

        // pipe to transition function
        const transitionalValue = (animation.transition as Transition).calculate(pct);

        // call the callback function
        animation.callback(renderable, transitionalValue);
    }

    /**
     * get the next visible entity texture
     * @param data the data for this animation
     */
    private getNextAnimationIndex(animation: Required<SpriteAnimation>): number {

        const activeAnimation = (animation as ActiveAnimation).__activeAnimation;

        // calculate the amount of ms for the complete animation
        const availableImages = (animation.animate as SpriteResource).getAnimationImages().length - 1;
        const animationLifeTime = 1000 / animation.fps * availableImages;

        // get the current percentage of completion for the animation
        let completion = (activeAnimation.visibleTime % animationLifeTime) / animationLifeTime;

        // tweak animation using the transition function
        completion = (animation.transition as Transition).calculate(completion);

        // get the image index based on the completion
        return Math.round(completion * availableImages);
    }

}
