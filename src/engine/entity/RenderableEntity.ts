import { Entity } from "./Entity";
import { ImageResource } from "../resource/sprite/ImageResource";

/**
 * an entity that can be rendered using a `RenderContext`
 */
export interface RenderableEntity extends Entity {

    /**
     * set this entity visible or unvisible for the `RenderContext`
     * @param visibleState the new visibility state
     */
    setVisible(visibleState: boolean): ThisType<RenderableEntity>;

    /**
     * check if this entity is visible for the `RenderContext`
     */
    isVisible(): boolean;

    /**
     * set the texture for this entity
     * @param texture the texture for this entity
     */
    setTexture(texture: ImageResource): ThisType<RenderableEntity>;

    /**
     * get the current texture of the entity
     */
    getTexture(): ImageResource;

}
