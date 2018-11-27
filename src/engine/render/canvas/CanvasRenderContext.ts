import { RenderContext } from "../RenderContext";
import { Singleton } from "../../constraint/Singleton";
import { BaseRenderContext } from "../BaseRenderContext";
import { RenderableEntity } from "../../entity/RenderableEntity";
import { ImageResource } from "../../resource/sprite/ImageResource";
import { Vector } from "../../math/Vector";
import { TileWorld } from "../../resource/tileset/TileWorld";

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

    /**
     * @inheritdoc
     */
    public drawTileWorld(world: TileWorld): void {

        // get world size
        const size = world.getWorldSize();
        const tileDimension = world.getTileDimension();
        const layers = world.getWorldLayerCount();

        const scale = Vector.from(1.2);
        const scaledDimension = tileDimension.multiply(scale);

        // iterate over every y tile
        for (let y = 0; y < size.y; y++) {

            // iterate over every x tile
            for (let x = 0; x < size.x; x++) {

                // draw the image at the given position
                const positionVector = Vector.from(x, y);
                const drawPositionVector = positionVector.multiply(tileDimension).multiply(scale);

                // iterate over the layers
                for (let layer = 0; layer < layers; layer++) {

                    // get and draw the tile
                    const tileNumber = world.getTileAtPosition(positionVector, layer);
                    const image = world.getTileByNumber(tileNumber || -1);

                    // image check
                    if (image !== undefined) {
                        this.context.drawImage(image.getData(), drawPositionVector.x, drawPositionVector.y, scaledDimension.x, scaledDimension.y);
                    }
                }
            }
        }
    }

    /**
     * @inheritdoc
     */
    public drawText(text: string, position: Vector): void {

        this.context.transform(1, 0, 0, 1, 0, 0);

        this.context.font = "12px Arial";
        this.context.fillStyle = "black";
        this.context.fillText(text, position.x, position.y);
    }

    /**
     * @inheritdoc
     */
    public drawImageAtPosition(image: ImageResource, position: Vector, dimension?: Vector): void {

        if (dimension) {
            this.context.drawImage(image.getData(), position.x, position.y, dimension.x, dimension.y);
        } else {
            this.context.drawImage(image.getData(), position.x, position.y);
        }
    }
}
