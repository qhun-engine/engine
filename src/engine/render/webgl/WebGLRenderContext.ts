import { RenderContext } from "../RenderContext";
import { BaseRenderContext } from "../BaseRenderContext";
import { Singleton } from "../../constraint/Singleton";
import { RenderableEntity } from "../../entity/RenderableEntity";
import { Vector } from "../../math/Vector";
import { RenderableTileWorld } from "../../resource/tileset/RenderableTileWorld";
import { ImageResource } from "../../resource/sprite/ImageResource";
import { TilePerspectiveRendering } from "../util/TileRendering";

/**
 * the webgl render context
 */
@Singleton()
export class WebGLRenderContext extends BaseRenderContext implements RenderContext {

    constructor(
        private canvas: HTMLCanvasElement,
        private context: WebGLRenderingContext
    ) { super(); }

    /**
     * @inheritdoc
     */
    public drawEntity(entity: RenderableEntity): void {
        // @todo: implement
    }

    /**
     * @inheritdoc
     */
    public drawTileWorld(world: RenderableTileWorld, renderer: TilePerspectiveRendering): void {
        // @todo: implement
    }

    /**
     * @inheritdoc
     */
    public drawText(text: string, position: Vector): void {

        // @todo: implement
    }

    /**
     * @inheritdoc
     */
    public drawImageAtPosition(image: ImageResource, position: Vector, dimension?: Vector): void {

        // @todo: implement
    }
}
