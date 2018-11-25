import { AnimationableEntity } from "../entity/AnimationableEntity";
import { ImageResource } from "../resource/sprite/ImageResource";
import { Destroyable } from "../constraint/Destroyable";

/**
 * a control class that allows to stop and resume the animation, increases speed...
 */
export class AnimationStateControl implements Destroyable {

    public currentIndex: number = 0;
    public availableAnimations: number = this.animationImages.length - 1;
    public currentImageVisibleTime: number = 0;

    public paused: boolean = false;
    public destroyed: boolean = false;

    constructor(
        public entity: AnimationableEntity,
        public animationImages: ImageResource[],
        public fps: number
    ) { }

    /**
     * get internal animation state data
     * @internal
     */
    public getAnimationInternalData(): {
        entity: AnimationableEntity,
        images: ImageResource[],
        fps: number,
        index: number,
        available: number,
        currentVisibleTime: number,
        paused: boolean,
        destroyed: boolean
    } {
        return {
            entity: this.entity,
            images: this.animationImages,
            fps: this.fps,
            index: this.currentIndex,
            available: this.availableAnimations,
            currentVisibleTime: this.currentImageVisibleTime,
            paused: this.paused,
            destroyed: this.destroyed
        };
    }

    /**
     * set internal animation state data
     * @internal
     */
    public increaseVisibleTime(time: number): void {

        this.currentImageVisibleTime += time;
    }

    /**
     * resets the visible time
     * @internal
     */
    public resetVisibleTime(): void {

        this.currentImageVisibleTime = 0;
    }

    /**
     * set the animation image index
     * @param index the index
     * @internal
     */
    public setAnimationImageIndex(index: number): void {

        this.currentIndex = index;
    }

    /**
     * stops this animation
     */
    public stop(): void {

        this.paused = true;
    }

    /**
     * resumes this animation
     */
    public resume(): void {

        this.paused = false;
    }

    /**
     * set the new animation speed
     * @param newFps the new frames per second of the animation
     */
    public setSpeed(newFps: number): void {

        this.fps = newFps;
    }

    /**
     * destroys this animation
     */
    public destroy(): void {

        this.destroyed = true;
    }
}
