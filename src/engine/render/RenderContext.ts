import { RenderableEntity } from "../entity/RenderableEntity";
import { Entity } from "../entity/Entity";
import { Vector } from "../math/Vector";
import { RenderableWorld } from "../world/RenderableWorld";
import { ImageResource } from "../resource/sprite/ImageResource";
import { TilePerspectiveRendering } from "./util/TileRendering";
import { Camera } from "../camera/Camera";
import { World } from "../world/World";

/**
 * an abstraction layer for webgl and canvas context based rendering
 */
export interface RenderContext {

    /**
     * function is called before the draw phase in the game loop
     */
    before(): void;

    /**
     * apply camera positioning and camera effects
     */
    after(): void;

    /**
     * use the given camera for positioning the renderable objects on the screen
     * @param camera the camera to use
     */
    useCamera(camera: Camera): void;

    /**
     * use the given perspective renderer class for perspective depending translation of coordinates
     * @param perspectiveRenderer the perspective renderer class
     */
    usePerspectiveRenderer(perspectiveRenderer: TilePerspectiveRendering): void;

    /**
     * use the given world for positioning issues
     * @param world the world to use
     */
    useWorld(world: World): void;

    /**
     * draws the given entity
     * @param entity the entity to draw
     */
    drawEntity(entity: RenderableEntity): void;

    /**
     * draws the given world
     * @param world the world to draw
     */
    drawWorld(world: World): void;

    /**
     * draws the given text onto the given position
     * @param text the text to draw
     * @param position the position of the text
     */
    drawText(text: string, position: Vector): void;

    /**
     * draws the given image at the given position
     * @param image the image
     * @param position the position
     * @param dimension optional the croped image
     */
    drawImageAtPosition(image: ImageResource, position: Vector, dimension?: Vector): void;

    /**
     * test if the given entity is renderable
     * @param entity the entity to test
     */
    isEntityRenderable(entity: Entity): entity is RenderableEntity;

}
