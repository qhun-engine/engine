import { CollidableEntity } from "../CollidableEntity";
import { RenderableEntity } from "../RenderableEntity";
import { AnimationManager } from "../../animation/AnimationManager";
import { SpriteResource } from "../../resource/sprite/SpriteResource";
import { ImageResource } from "../../resource/sprite/ImageResource";
import { Vector } from "../../math/Vector";
import { Inject } from "../../di/Inject";
import { CollisionType } from "../../collision/CollisionType";
import { MovingEntity } from "../MovingEntity";

/**
 * an entity class that implements renderability, animations, collisions
 */
export abstract class ActorEntity implements CollidableEntity, RenderableEntity, MovingEntity {

    @Inject()
    private animationManager!: AnimationManager;

    /**
     * storage for animations of the entity
     */
    private animations: {
        [name: string]: { sprite: SpriteResource, fps: number }
    } = {};

    /**
     * is the entity currently visible for the renderer
     */
    protected visible: boolean = true;

    /**
     * the texture resource
     */
    protected resource!: HTMLImageElement;

    /**
     * the current position of the entity
     */
    protected position: Vector = Vector.ZERO;

    /**
     * the current velocity of the entity
     */
    protected velocity: Vector = Vector.ZERO;

    /**
     * the anchor point of the entity
     */
    protected anchor: Vector = Vector.HALF;

    /**
     * the size of the entity
     */
    protected size: Vector = Vector.ZERO;

    /**
     * current rotation of the entity
     */
    protected rotation: number = 0;

    /**
     * the collision type of the entity
     */
    protected collisionType: CollisionType = CollisionType.Rectangle;

    /**
     * the collision ignore state of the entity
     */
    protected ignoreCollision: boolean = false;

    /**
     * the current moving speed in pixel per second
     */
    protected speed: number = 0;

    /**
     * the current friction of the entity
     */
    protected friction: number = 0;

    /**
     * @inheritdoc
     */
    public setVisible(visibleState: boolean): this {

        this.visible = visibleState;
        return this;
    }

    /**
     * @inheritdoc
     */
    public isVisible(): boolean {

        return this.visible;
    }

    /**
     * @inheritdoc
     */
    public setTexture(texture: HTMLImageElement): this {

        this.resource = texture;
        return this;
    }

    /**
     * @inheritdoc
     */
    public setRenderableTexture(texture: HTMLImageElement): this {

        this.resource = texture;
        return this;
    }

    /**
     * @inheritdoc
     */
    public getTexture(): HTMLImageElement {

        return this.resource;
    }

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
    public setSpeed(speed: number): this {

        this.speed = speed;
        return this;
    }

    /**
     * @inheritdoc
     */
    public getSpeed(): number {

        return this.speed;
    }

    /**
     * @inheritdoc
     */
    public getCenter(): Vector {

        return this.position.add(this.size.half());
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
    public getFriction(): number {

        return this.friction;
    }

    /**
     * @inheritdoc
     */
    public setFriction(friction: number): this {

        this.friction = friction;
        return this;
    }

    /**
     * @inheritdoc
     */
    public getAnchor(): Vector {

        return this.anchor;
    }

    /**
     * @inheritdoc
     */
    public setAnchor(anchor: Vector): this {

        this.anchor = anchor;
        return this;
    }

    /**
     * @inheritdoc
     */
    public destroy(): void {
        // noop
    }

    /**
     * @inheritdoc
     */
    public getSize(): Vector {
        return this.size;
    }

    /**
     * @inheritdoc
     */
    public setSize(size: Vector): this {
        this.size = size;
        return this;
    }

    /**
     * @inheritdoc
     */
    public getRotation(): number {

        return this.rotation;
    }

    /**
     * @inheritdoc
     */
    public setRotation(rotation: number): this {

        this.rotation = rotation;
        return this;
    }

    /**
     * @inheritdoc
     */
    public getCollisionType(): CollisionType {

        return this.collisionType;
    }

    /**
     * @inheritdoc
     */
    public setCollisionType(type: CollisionType): this {

        this.collisionType = type;
        return this;
    }

    /**
     * @inheritdoc
     */
    public setCollisionIgnore(ignoreCollision: boolean): this {

        this.ignoreCollision = ignoreCollision;
        return this;
    }

    /**
     * @inheritdoc
     */
    public isCollisionIgnored(): boolean {

        return this.ignoreCollision;
    }

    /**
     * @inheritdoc
     */
    public move(position: Vector): this {

        // replace the current velocity with the target position
        const tempVelocity = this.velocity.add(position.substract(this.position));

        // finally set the velocity
        this.velocity = tempVelocity;

        return this;
    }
}
