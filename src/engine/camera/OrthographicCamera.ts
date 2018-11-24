import { Vector } from "../math/Vector";
import { BaseCamera } from "./BaseCamera";
import { Transition } from "../animation/transition/Transition";
import { RenderContext } from "../render/RenderContext";
import { TransitionContainer } from "../animation/transition/TransitionContainer";
import { Inject } from "../di/Inject";

/**
 * A 2d based camera for projecting 3d objects onto a 2d viewport
 */
export class OrthographicCamera extends BaseCamera {

    @Inject()
    protected transitions!: TransitionContainer;

    /**
     * @inheritdoc
     */
    public shake(intensity: Vector, duration: number, transition: Transition = this.transitions.getEaseInOut()): void {
        /** noop */
    }

    /**
     * @inheritdoc
     */
    public zoom(scale: number, duration: number, transition: Transition = this.transitions.getEaseInOut()): void {
        /** noop */
    }

    /**
     * @inheritdoc
     */
    public update(delta: number): void {
        /** noop */
    }

    /**
     * @inheritdoc
     */
    public draw(context: RenderContext): void {
        /** noop */
    }

}
