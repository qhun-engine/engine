import { ClassConstructor } from "@qhun-engine/base";
import { SpriteResource } from "../resource/sprite/SpriteResource";
import { Transition } from "./transition/Transition";
import { Renderable } from "../constraint/Renderable";
import { TransitionInBound } from "./transition/TransitionInBound";

declare type AnimatedCallback<T> = (renderable: T, delta: number) => void;

interface AnimationBase {

    /**
     * the animation name
     */
    name: string;
}

export interface SpriteAnimation<A = SpriteResource | Promise<SpriteResource>> extends AnimationBase {

    /**
     * the animation speed in frames per second
     */
    fps: number;

    /**
     * - **SpriteResource**: Your animation as sprite resource
     * - **Promise<SpriteResource>**: Your animation will be added when the given promise resolves
     */
    animate: A;

    /**
     * an optional transition effect for the animation
     * @default Transition.Linear
     */
    transition?: TransitionInBound | ClassConstructor<TransitionInBound>;
}

export interface CallbackAnimation<R extends Renderable = Renderable> extends AnimationBase {

    /**
     * the amount of time in milliseconds this callback function should be animated
     */
    time: number;

    /**
     * Your callback function to animate the renderable object
     */
    callback: AnimatedCallback<R>;

    /**
     * an optional transition effect for the animation
     * @default Transition.Linear
     */
    transition?: Transition | ClassConstructor<Transition>;
}

/**
 * defines an animation process
 */
export declare type Animation<R extends Renderable = Renderable, A = SpriteResource | Promise<SpriteResource>> = SpriteAnimation<A> | CallbackAnimation<R>;

/**
 * type guard function for sprite animations
 * @param animation the animation to test
 */
export function isSpriteAnimation(animation: object): animation is SpriteAnimation {

    return !!(animation as SpriteAnimation).animate;
}

/**
 * type guard function for callback animations
 * @param animation the animation to test
 */
export function isCallbackAnimation(animation: object): animation is CallbackAnimation {

    return typeof (animation as CallbackAnimation).callback === "function";
}
