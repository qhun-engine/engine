import { Singleton } from "@qhun-engine/base";
import { RenderContext } from "../RenderContext";
import { BaseRenderContext } from "../BaseRenderContext";
import { RenderableEntity } from "../../entity/RenderableEntity";
import { ImageResource } from "../../resource/sprite/ImageResource";
import { Vector } from "../../math/Vector";
import { World } from "../../world/World";

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

        // reset transform matrix
        this.context.setTransform(1, 0, 0, 1, 0, 0);

        if (this.camera) {

            // get viewport and zoom
            const vp = this.camera.getViewport();
            const zoom = this.camera.getZoom();

            // apply to context
            this.context.scale(zoom, zoom);
            this.context.translate(-vp.x, -vp.y);
        }
    }

    /**
     * @inheritdoc
     */
    public after(): void {

        /*if (this.camera) {
            const vp = this.camera.getViewport();
            console.log(vp);
            this.context.translate(vp.x, vp.y);
        }*/
    }

    /**
     * @inheritdoc
     */
    public drawEntity(entity: RenderableEntity): void {

        // does this entity has a valid texture?
        if (entity.getTexture()) {

            // get the image
            const image = entity.getTexture();

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
                // add the max size of the entity
                .add(entity.getSize().multiply(Vector.HALF));

            // draw the image
            this.context.translate(currentPosition.x, currentPosition.y);
            this.context.translate(currentImageVector.x / 2, currentImageVector.y / 2);
            this.context.rotate(entity.getRotation());

            // calculate cartesian x,y
            const cartesianPosition = Vector.from(currentImageVector.x / 2, currentImageVector.y / 2);

            // add perspective translation
            let perspectiveTranslation = cartesianPosition;
            if (this.world) {

                // get world tile info
                const tileDim = this.world.getTileSize();

                // perform translation
                perspectiveTranslation = this.perspectiveRenderer.getTranslatedPosition(
                    cartesianPosition.x, cartesianPosition.y, tileDim.x, tileDim.y
                );
            }

            this.context.drawImage(image, -perspectiveTranslation.x, -perspectiveTranslation.y);

            // reset transform matrix
            this.context.setTransform(1, 0, 0, 1, 0, 0);
        }
    }

    /**
     * @inheritdoc
     */
    public drawWorld(world: World): void {

        // draw the given tileworld
        const layers = world.getLayerCount();
        const size = world.getTileNumbers();
        const tileSize = world.getTileSize();

        // get static offset for the given perspective
        const staticOffset = this.perspectiveRenderer.getOffset(size.x, size.y, tileSize.x, tileSize.y);

        // iterate over all tiles that should be drawn
        for (let l = 0; l < layers; l++) {

            // get layout for this layer
            const layout = world.getLayout(l);

            // iterate over y coordinate
            layout.forEach(column => {
                column.forEach(tile => {

                    // get tile position and image
                    const tilePosition = tile.getPosition();
                    const image = tile.getTexture();

                    // draw if image is available
                    if (image && tilePosition) {

                        // calculate the drawing position based on the perspective
                        const drawingPosition = this.perspectiveRenderer
                            // translate to perspective
                            .getDrawingCoordinate(tilePosition.x, tilePosition.y, tileSize.x, tileSize.y)
                            // add static offset
                            .add(staticOffset);

                        // draw the image at the calculated position
                        this.context.drawImage(image, drawingPosition.x, drawingPosition.y);
                    }
                });
            });
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
