import { Entity } from "./Entity";
import { Renderable } from "../constraint/Renderable";

/**
 * an entity that can be rendered using a `RenderContext`
 */
export interface RenderableEntity extends Entity, Renderable {

    /**
     * set this entity visible or unvisible for the `RenderContext`
     * @param visibleState the new visibility state
     */
    setVisible(visibleState: boolean): ThisType<RenderableEntity>;

    /**
     * check if this entity is visible for the `RenderContext`
     */
    isVisible(): boolean;

}
