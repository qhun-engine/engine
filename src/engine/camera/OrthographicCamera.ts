import { Vector } from "../math/Vector";
import { BaseCamera } from "./BaseCamera";
import { Transition } from "../animation/transition/Transition";
import { Engine } from "../Engine";
import { RenderContext } from "../render/RenderContext";
import { TransitionFactory } from "../animation/transition/TransitionFactory";

/**
 * A 2d based camera for projecting 3d objects onto a 2d viewport
 */
export class OrthographicCamera extends BaseCamera {

    /**
     * @inheritdoc
     */
    public shake(intensity: Vector, duration: number, transition: Transition = TransitionFactory.createEaseInOut()): void {
        /** noop */
    }

    /**
     * @inheritdoc
     */
    public zoom(scale: number, duration: number, transition: Transition = TransitionFactory.createEaseInOut()): void {
        /** noop */
    }

    /**
     * @inheritdoc
     */
    public update(engine: Engine, delta: number): void {
        /** noop */
    }

    /**
     * @inheritdoc
     */
    public draw(context: RenderContext): void {
        /** noop */
    }

}
