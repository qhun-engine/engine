import { CollidableEntity } from "../CollidableEntity";
import { RenderableEntity } from "../RenderableEntity";
import { AnimationManager } from "../../animation/AnimationManager";
import { SpriteResource } from "../../resource/sprite/SpriteResource";
import { ImageResource } from "../../resource/sprite/ImageResource";
import { Vector } from "../../math/Vector";
import { Inject } from "../../di/Inject";
import { CollisionType } from "../../collision/CollisionType";

/**
 * an entity class that implements renderability, animations, collisions
 */
export abstract class ActorEntity implements CollidableEntity, RenderableEntity {

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
    protected resource!: ImageResource;

    /**
     * the current position of the entity
     */
    protected position: Vector = Vector.ZERO;

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
    public setTexture(texture: ImageResource): this {

        this.resource = texture;
        return this;
    }

    /**
     * @inheritdoc
     */
    public setRenderableTexture(texture: ImageResource): this {

        this.resource = texture;
        return this;
    }

    /**
     * @inheritdoc
     */
    public getTexture(): ImageResource {

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
}
