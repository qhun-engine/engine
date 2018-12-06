import {
    Injectable, Injector, MetadataRegistryService,
    ReflectionMetadata, ClassConstructor
} from "@qhun-engine/base";

import { Renderable } from "../constraint/Renderable";
import { Animation, SpriteAnimation, CallbackAnimation } from "./Animation";
import { Animator } from "./Animator";
import { Linear } from "./transition/Linear";
import { AnimationError } from "../exception/AnimationError";
import { Transition } from "./transition/Transition";

interface AnimatedRenderable extends Renderable {

    /**
     * all currently declared animations of this renderable object
     */
    __declaredAnimations?: {
        [animationName: string]: Animation<Renderable>
    };
}

/**
 * responsable for controling animation states on entities
 */
@Injectable()
export class AnimationManager {

    /**
     * the animator instance
     */
    private animator: Animator = new Animator();

    /**
     * the injector
     */
    private injector: Injector = Injector.getInstance();

    /**
     * the metadata registry
     */
    private metadataRegistry: MetadataRegistryService = MetadataRegistryService.getInstance();

    constructor(
        private linearTransition: Linear
    ) { }

    /**
     * declare the given animation on the renderable object
     * @param renderable the object that should be animated
     * @param animation the animation metadata
     */
    public addAnimation<R extends AnimatedRenderable>(renderable: R, animation: SpriteAnimation | CallbackAnimation<R>): void {

        // init if nessesary
        renderable.__declaredAnimations = renderable.__declaredAnimations || {};

        // add animation
        renderable.__declaredAnimations[animation.name] = Object.assign({}, animation) as Animation;
    }

    /**
     * starts the named animation for the given object.
     * @param renderable the renderable object
     * @param animation the animation name or animation callback to play
     */
    public startAnimation<R extends AnimatedRenderable>(renderable: R, animation: string | CallbackAnimation<R>): any {

        // declare playable animation
        let playableAnimation: Animation<R>;

        // get the animation data
        if (typeof animation === "string") {
            playableAnimation = (renderable as Required<AnimatedRenderable>).__declaredAnimations[animation];
        } else {

            // declare this animation for furure stopping
            this.addAnimation(renderable, animation);
            playableAnimation = animation;
        }

        // valid check
        if (!playableAnimation) {

            throw new AnimationError(`Animation ${typeof animation === "string" ? `with the name ${playableAnimation}` : ""} does not exist on ${renderable}`);
        }

        // add default / verify transition
        try {
            if (playableAnimation.transition) {

                // if this is a class constructor, get it!
                if (
                    typeof playableAnimation.transition === "function" &&
                    this.metadataRegistry.exists(ReflectionMetadata.Injectable, playableAnimation.transition)
                ) {

                    // get it using the injector
                    playableAnimation.transition = this.injector.instantiateClass<Transition>(playableAnimation.transition as ClassConstructor<Transition>);
                } else if (typeof playableAnimation.transition === "function") {

                    // instantiate it
                    playableAnimation.transition = new playableAnimation.transition();
                }
            } else {
                playableAnimation.transition = this.linearTransition;
            }

        } catch (e) {

            throw new AnimationError(`Your given transition object/class/function is invalid! Error was: ${e}`);
        }

        // set transition function
        playableAnimation.transition = playableAnimation.transition ? playableAnimation.transition : this.linearTransition;

        // play the stored animation
        this.animator.startAnimation(renderable, playableAnimation);
    }

    /**
     * stops the given animation on the object
     * @param renderable the renderable object
     * @param animationName the animation name to stop
     */
    public stopAnimation(renderable: Renderable, animationName: string): void {

        // stop this animation
        // get the animation data
        const animation = (renderable as Required<AnimatedRenderable>).__declaredAnimations[animationName];

        // valid check
        if (!animation) {

            throw new AnimationError(`Animation with the name ${animationName} does not exist on ${renderable}`);
        }

        // play the stored animation
        this.animator.stopAnimation(renderable, animation);
    }

}
