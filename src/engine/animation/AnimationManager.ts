import { AnimationableEntity } from "../entity/AnimationableEntity";
import { AnimationStateControl } from "./AnimationStateControl";
import { Injectable } from "../di/Injectable";
import { SpriteResource } from "../resource/sprite/SpriteResource";
import { Draw } from "../util/decorators/Draw";

/**
 * responsable for controling animation states on entities
 */
@Injectable()
export class AnimationManager {

    private animationStorage: AnimationStateControl[] = [];

    /**
     * plays the given animation on the given entity
     * @param entity the entity on wich the animation should be played
     * @param sprite the sprite resource used for animations
     * @param fps the speed of the animation
     */
    public playEntityAnimation(entity: AnimationableEntity, sprite: SpriteResource, fps: number = 1): AnimationStateControl {

        // add to storage
        const stateControl = new AnimationStateControl(entity, sprite.getAnimationImages(), fps);

        // push the control to the animation storage
        this.animationStorage.push(stateControl);
        return stateControl;
    }

    @Draw()
    public updateAnimations(delta: number, timeDelta: number): void {

        // destroy old animations
        this.animationStorage = this.animationStorage.filter(anim => !anim.getAnimationInternalData().destroyed);

        // handle every animation in the storage
        this.animationStorage.forEach(anim => {

            // dont go with paused animations
            if (anim.isPaused()) {
                return;
            }

            // check if next image should be visible
            anim.increaseVisibleTime(timeDelta);

            // get current and next index
            const data = anim.getAnimationInternalData();
            const currentIndex = data.index;
            const nextIndex = this.getNextAnimationIndex(data);

            // if the index is different then show the new image
            if (nextIndex !== currentIndex) {

                // reset visible time
                anim.resetVisibleTime();

                // set new index
                anim.setAnimationImageIndex(nextIndex);

                // show next image
                data.entity.setRenderableTexture(data.images[nextIndex]);
            }

            // next frame ready to draw?
            /*if (data.currentVisibleTime >= animImageLifeTime) {

                // reset currentImageVisibleTime
                anim.resetVisibleTime();

                // check index
                if (data.index + 1 > data.available) {
                    anim.setAnimationImageIndex(0);
                    data.index = 0;
                } else {

                    // increase index
                    anim.setAnimationImageIndex(data.index + 1);
                    data.index += 1;
                }

                data.entity.setRenderableTexture(data.images[data.index]);
            }*/
        });
    }

    /**
     * get the next visible entity texture
     * @param data the data for this animation
     */
    private getNextAnimationIndex(data: ReturnType<AnimationStateControl["getAnimationInternalData"]>): number {

        // get animation image life time per image
        // eg. 16.67ms at 60 fps
        const animImageLifeTime = 1000 / data.fps;

        // get current data
        const currentLifeTime = data.currentVisibleTime;
        let currentIndex = data.index;

        // index should be increased if the animationLifeTime is exeeded. it it is exeeded multiple times
        // the index should go up for every nth exeed
        const lifeTimeDelta = currentLifeTime / animImageLifeTime;
        const incrementor = Math.floor(lifeTimeDelta);

        // increase index
        currentIndex += incrementor;

        // check available image bounds
        while (currentIndex > data.available) {

            // set the index to the offset
            currentIndex = currentIndex - data.available;
        }

        return currentIndex;
    }
}
