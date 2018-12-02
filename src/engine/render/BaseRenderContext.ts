import { RenderContext } from "./RenderContext";
import { Entity } from "../entity/Entity";
import { RenderableEntity } from "../entity/RenderableEntity";
import { Camera } from "../camera/Camera";

/**
 * a base class for render context classes
 */
export abstract class BaseRenderContext implements Partial<RenderContext> {

    protected camera!: Camera;

    /**
     * @inheritdoc
     */
    public isEntityRenderable(entity: Entity): entity is RenderableEntity {

        return typeof (entity as RenderableEntity).setTexture === "function";
    }

    /**
     * @inheritdoc
     */
    public useCamera(camera: Camera): void {

        this.camera = camera;
    }

    /**
     * @inheritdoc
     */
    public before(): void {

        // noop
    }

    /**
     * @inheritdoc
     */
    public after(): void {

        // noop
    }

}
