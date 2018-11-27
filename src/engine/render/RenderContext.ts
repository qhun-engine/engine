import { RenderableEntity } from "../entity/RenderableEntity";
import { Entity } from "../entity/Entity";
import { Vector } from "../math/Vector";
import { TileWorld } from "../resource/tileset/TileWorld";
import { ImageResource } from "../resource/sprite/ImageResource";

/**
 * an abstraction layer for webgl and canvas context based rendering
 */
export interface RenderContext {

    /**
     * function is called before the draw login in the game loop
     */
    before(): void;

    /**
     * draws the given entity
     * @param entity the entity to draw
     */
    drawEntity(entity: RenderableEntity): void;

    /**
     * draws the tilemap based world
     * @param world the tile world to draw
     */
    drawTileWorld(world: TileWorld): void;

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
