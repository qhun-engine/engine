import { RenderContext } from "./RenderContext";
import { Entity } from "../entity/Entity";
import { RenderableEntity } from "../entity/RenderableEntity";
import { Camera } from "../camera/Camera";
import { TilePerspectiveRendering } from "./util/TileRendering";
import { World } from "../world/World";

/**
 * a base class for render context classes
 */
export abstract class BaseRenderContext implements Partial<RenderContext> {

    /**
     * the currently active camera
     */
    protected camera!: Camera;

    /**
     * the current existing perspective tile renderer
     */
    protected perspectiveRenderer!: TilePerspectiveRendering;

    /**
     * the currently active world
     */
    protected world!: World;

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
    public usePerspectiveRenderer(perspectiveRenderer: TilePerspectiveRendering): void {

        this.perspectiveRenderer = perspectiveRenderer;
    }

    /**
     * @inheritdoc
     */
    public useWorld(world: World): void {

        this.world = world;
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
