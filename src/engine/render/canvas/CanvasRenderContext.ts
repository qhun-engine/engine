import { RenderContext } from "../RenderContext";
import { Singleton } from "../../constraint/Singleton";
import { BaseRenderContext } from "../BaseRenderContext";
import { RenderableEntity } from "../../entity/RenderableEntity";
import { ImageResource } from "../../resource/sprite/ImageResource";
import { Vector } from "../../math/Vector";

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

            // get the image
            const image = entity.getTexture().getData();

            // get the anchor point to check where to draw the image in order
            // to be at the entities position
            const currentImageVector = Vector.from(image.width, image.height);
            const currentPosition = entity
                // get current
                .getPosition()
                // add anchor point based of the width
                .add(
                    currentImageVector.multiply(
                        // multiply the image width/height by the anchor point
                        entity.getAnchor()
                    )
                ).substract(currentImageVector)
                // finally add the max size of the entity
                .add(entity.getSize().multiply(Vector.HALF));

            // draw the image
            this.context.translate(currentPosition.x, currentPosition.y);
            this.context.translate(currentImageVector.x / 2, currentImageVector.y / 2);
            this.context.rotate(entity.getRotation());
            this.context.drawImage(image, -(currentImageVector.x / 2), -(currentImageVector.y / 2));

            // reset transform matrix
            this.context.setTransform(1, 0, 0, 1, 0, 0);
        }
    }
}
