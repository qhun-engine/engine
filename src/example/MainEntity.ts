import { RenderableEntity } from "../engine/entity/RenderableEntity";
import { ImageResource } from "../engine/resource/sprite/ImageResource";
import { Vector } from "../engine/math/Vector";
import { AnimationableEntity } from "../engine/entity/AnimationableEntity";
import { Inject } from "../engine/di/Inject";
import { AnimationManager } from "../engine/animation/AnimationManager";
import { SpriteResource } from "../engine/resource/sprite/SpriteResource";
import { AnimationStateControl } from "../engine/animation/AnimationStateControl";
import { DeclareAnimation } from "../engine/resource/decorator/DeclareAnimation";

@DeclareAnimation([{
    name: "idle",
    animation: "assets/fighter.json",
    image: "assets/fighter.png",
    fps: 60
}, {
    name: "idle2",
    animation: "assets/fighter.json",
    image: "assets/fighter.png",
    fps: 60
}])
export class MainEntity implements RenderableEntity, AnimationableEntity {

    @Inject()
    private animationManager!: AnimationManager;

    private animations: {
        [name: string]: { sprite: SpriteResource, fps: number }
    } = {};

    protected visible: boolean = true;
    protected resource!: ImageResource;
    protected position: Vector = Vector.ZERO;
    protected anchor: Vector = Vector.HALF;
    protected size: Vector = Vector.ZERO;
    protected rotation: number = 0;

    /**
     * set this entity visible or unvisible for the `RenderContext`
     * @param visibleState the new visibility state
     */
    public setVisible(visibleState: boolean): this {

        this.visible = visibleState;
        return this;
    }

    /**
     * check if this entity is visible for the `RenderContext`
     */
    public isVisible(): boolean {

        return this.visible;
    }

    /**
     * set the texture for this entity
     * @param texture the texture for this entity
     */
    public setTexture(texture: ImageResource): this {

        this.resource = texture;

        // update size
        this.size = Vector.from(texture.getData().width, texture.getData().height);

        return this;
    }

    /**
     * set the texture for this entity
     * @param texture the texture for this entity
     */
    public setRenderableTexture(texture: ImageResource): this {

        this.resource = texture;
        return this;
    }

    /**
     * get the current texture of the entity
     */
    public getTexture(): ImageResource {

        return this.resource;
    }

    /**
     * get the position of this entity
     */
    public getPosition(): Vector {

        return this.position;
    }

    /**
     * set the new position for this entity
     * @param position the new position
     */
    public setPosition(position: Vector): this {

        this.position = position;
        return this;
    }

    /**
     * get the anchor point of this entity
     */
    public getAnchor(): Vector {

        return this.anchor;
    }

    /**
     * set the anchor point for this entity
     * @param anchor the new anchor point
     */
    public setAnchor(anchor: Vector): this {

        this.anchor = anchor;
        return this;
    }

    public destroy(): void {
        // noop
    }

    /**
     * add the given animation to the entity using the given name
     * @param animationName the unique name for this animation
     * @param sprite the animation sprite file
     * @param fps the speed of the animation
     */
    public addAnimation(animationName: string, sprite: SpriteResource, fps: number = 1): this {

        this.animations[animationName] = { sprite, fps };
        return this;
    }

    /**
     * plays the given animation on the entity
     * @param animationName the name of the animation to play
     */
    public playAnimation(animationName: string): AnimationStateControl {

        return this.animationManager.playEntityAnimation(this, this.animations[animationName].sprite, this.animations[animationName].fps);
    }

    /**
     * stop all animations on this entity
     */
    public stopAnimation(): void {

        // noop
    }

    /**
     * get the size of the entity
     */
    public getSize(): Vector {
        return this.size;
    }

    /**
     * set the new size of the entity
     * @param size the new size
     */
    public setSize(size: Vector): this {
        this.size = size;
        return this;
    }

    /**
     * get the current rotation in radians
     */
    public getRotation(): number {

        return this.rotation;
    }

    /**
     * set the new rotation in radians
     * @param rotation the new rotation in radians
     */
    public setRotation(rotation: number): this {

        this.rotation = rotation;
        return this;
    }
}
