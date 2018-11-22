import { Camera } from "./Camera";
import { Vector } from "../math/Vector";
import { Transition } from "../animation/transition/Transition";
import { Engine } from "../Engine";
import { RenderContext } from "../render/RenderContext";

/**
 * the base camera for all known cameras in the game
 */
export abstract class BaseCamera implements Camera {

    /**
     * the current moving velocity of the camera
     */
    protected velocity: Vector = Vector.ZERO;

    /**
     * @param position the current position of the camera
     * @param zoom the current zoom scale of the camera
     */
    constructor(
        protected position: Vector,
        protected zoomScale: number = 1
    ) { }

    /**
     * @inheritdoc
     */
    public getPosition(): Vector {
        return this.position;
    }

    /**
     * @inheritdoc
     */
    public setPosition(position: Vector): this {
        this.position = position;
        return this;
    }

    /**
     * @inheritdoc
     */
    public getVelocity(): Vector {
        return this.velocity;
    }

    /**
     * @inheritdoc
     */
    public setVelocity(velocity: Vector): this {
        this.velocity = velocity;
        return this;
    }

    /**
     * @inheritdoc
     */
    public getZoom(): number {
        return this.zoomScale;
    }

    /**
     * @inheritdoc
     */
    public setZoom(scale: number): this {
        this.zoomScale = scale;
        return this;
    }

    /**
     * @inheritdoc
     */
    public isMoving(): boolean {
        return false;
    }

    /**
     * @inheritdoc
     */
    public isZooming(): boolean {
        return false;
    }

    public abstract shake(intensity: Vector, duration: number, transition: Transition): void;
    public abstract zoom(scale: number, duration: number, transition: Transition): void;
    public abstract update(engine: Engine, delta: number): void;
    public abstract draw(context: RenderContext): void;

}
