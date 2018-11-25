import { RenderContext } from "./RenderContext";
import { Entity } from "../entity/Entity";
import { RenderableEntity } from "../entity/RenderableEntity";

/**
 * a base class for render context classes
 */
export abstract class BaseRenderContext implements Partial<RenderContext> {

    /**
     * @inheritdoc
     */
    public isEntityRenderable(entity: Entity): entity is RenderableEntity {

        return typeof (entity as RenderableEntity).setTexture === "function";
    }

    public before(): void {

        // noop
    }

}
