import { RenderContext } from "../RenderContext";
import { Singleton } from "../../constraint/Singleton";
import { BaseRenderContext } from "../BaseRenderContext";
import { RenderableEntity } from "../../entity/RenderableEntity";
import { ImageResource } from "../../resource/sprite/ImageResource";

/**
 * the canvas rendering context
 */
@Singleton()
export class CanvasRenderContext extends BaseRenderContext implements RenderContext {

    constructor(
        private canvas: HTMLCanvasElement,
        private context: CanvasRenderingContext2D
    ) { super(); }

    /**
     * @inheritdoc
     */
    public before(): void {

        // clear canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * @inheritdoc
     */
    public drawEntity(entity: RenderableEntity): void {

        // does this entity has a valid texture?
        if (entity.getTexture()) {

            this.context.drawImage(entity.getTexture().getData(), entity.getPosition().x, entity.getPosition().y);
        }
    }
}
