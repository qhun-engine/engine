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
    public updateAnimations(delta: number): void {

        // destroy old animations
        this.animationStorage = this.animationStorage.filter(anim => !anim.getAnimationInternalData().destroyed);

        // handle every animation in the storage
        this.animationStorage.forEach(anim => {

            const data = anim.getAnimationInternalData();

            // dont go with paused animations
            if (data.paused) {
                return;
            }

            // check if next image should be visible
            anim.increaseVisibleTime(delta);

            // get animation image life time
            // 1 fps means 1 image per ingame time second
            const animImageLifeTime = 1 / data.fps * 1000;

            // next frame ready to draw?
            if (data.currentVisibleTime >= animImageLifeTime) {

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

                anim.entity.setTexture(anim.animationImages[data.index]);
            }
        });
    }
}
