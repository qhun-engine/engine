import { Camera } from "./Camera";
import { Vector } from "../math/Vector";
import { Transition } from "../animation/transition/Transition";
import { RenderContext } from "../render/RenderContext";
import { Rectangle } from "../math/Rectangle";
import { CameraFollowStrategy } from "./follow/CameraFollowStrategy";
import { Followable } from "./follow/Followable";
import { FollowCenterStrategy } from "./follow/FollowCenterStrategy";

/**
 * the base camera for all known cameras in the game
 */
export abstract class BaseCamera implements Camera {

    /**
     * the current moving velocity of the camera
     */
    protected velocity: Vector = Vector.ZERO;

    /**
     * rectangle that represents the viewport
     */
    protected viewport: Rectangle = new Rectangle(this.position.x, this.position.y, this.near.x, this.near.y);

    /**
     * world bounds as rectangle
     */
    protected worldBounds: Rectangle = new Rectangle(0, 0, this.far.x, this.far.y);

    /**
     * the object that is beeing followed
     */
    protected followed!: Followable;

    /**
     * the following strategy of the object
     */
    protected followingStrategy!: CameraFollowStrategy<Followable>;

    /**
     * @param position the current position of the camera
     * @param near the visible area of the camera. in most cases it is the canvas width/height
     * @param far the maximum world size or maximin view range. In most cases world width/height
     * @param zoomScale the current zoom scale of the camera. Must be greater than 0
     */
    constructor(
        protected position: Vector,
        protected near: Vector,
        protected far: Vector,
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

    /**
     * @inheritdoc
     */
    public update(delta: number): void {

        // update camera position by following strategy
        if (this.followed) {

            // calculate new position using following strategies
            this.position = this.followingStrategy.process(this.followed, this, delta);
        }

        // adjust the viewport to center the current position
        const tempViewport = this.viewport;
        tempViewport.set(
            this.position.x - ((this.viewport.w + this.position.x) / 2),
            this.position.y - ((this.viewport.h + this.position.y) / 2)
        );

        // now check if the new viewport is within the world bounds
        if (!tempViewport.within(this.worldBounds)) {

            // left axis breakout
            if (tempViewport.x < this.worldBounds.x) {
                tempViewport.x = this.worldBounds.x;
            }

            // top axis breakout
            if (tempViewport.y < this.worldBounds.y) {
                tempViewport.y = this.worldBounds.y;
            }

            // right axis breakout
            if (tempViewport.right > this.worldBounds.right) {
                tempViewport.x = this.worldBounds.right - this.viewport.w;
            }

            // bottom axis breakout
            if (tempViewport.bottom > this.worldBounds.bottom) {
                tempViewport.y = this.worldBounds.bottom - this.viewport.h;
            }
        }

        // apply the new viewport
        this.viewport = tempViewport;
    }

    /**
     * @inheritdoc
     */
    public draw(context: RenderContext): void {

        // noop
    }

    /**
     * @inheritdoc
     */
    public getViewport(): Rectangle {

        return this.viewport;
    }

    /**
     * @inheritdoc
     */
    public follow<T extends Followable>(object: T, strategy: CameraFollowStrategy<T> = new FollowCenterStrategy()): this {

        this.followed = object;
        this.followingStrategy = strategy;
        return this;
    }

    public abstract shake(intensity: Vector, duration: number, transition: Transition): void;
    public abstract zoom(scale: number, duration: number, transition: Transition): void;

}
