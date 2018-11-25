import { Injectable } from "../../di/Injectable";
import { SpriteResource } from "./SpriteResource";
import { DimensionSize, DimensionPosition } from "../../animation/Dimension";
import { ImageResource } from "./ImageResource";

interface SpriteDecoupleResult extends DimensionSize {

    /**
     * name of the picture
     */
    name: string;

    /**
     * the final image element for rendering
     */
    image: ImageResource;
}

/**
 * responsable for decoupling sprite images from a sprite sheet using
 * the given metadata
 */
@Injectable()
export class SpriteImageExtractor {

    /**
     * the canvas element
     */
    private canvas: HTMLCanvasElement = document.createElement("canvas");

    /**
     * the canvas rendering context
     */
    private ctx: CanvasRenderingContext2D = (this.canvas.getContext("2d") as CanvasRenderingContext2D);

    /**
     * extracts all images from the sprite sheet using the given metadata
     * @param sprite the sprite to get the data from
     */
    public async extractImagesFromSpriteSheet(sprite: SpriteResource): Promise<SpriteDecoupleResult[]> {

        const images: HTMLImageElement[] = [];
        const convertPromiseStack: Promise<SpriteDecoupleResult>[] = [];

        // iterate over every possible sub file
        const frames = sprite.getAnimation().frames;
        Object.keys(frames).forEach(frameName => {

            const frameData = frames[frameName];

            // convert this frame into an image
            convertPromiseStack.push(this.extractImage(frameData.frame, sprite.getData()).then(imageData => {
                return {
                    name: frameName,
                    image: (new ImageResource()).setData(imageData)
                } as SpriteDecoupleResult;
            }));
        });

        return Promise.all(convertPromiseStack);
    }

    /**
     * extracts an image from the given position with given size from the origin image
     * @param predicate the position and size
     * @param origin the original sprite sheet image
     */
    private async extractImage(predicate: DimensionSize & DimensionPosition, origin: HTMLImageElement): Promise<HTMLImageElement> {

        // update canvas size
        this.canvas.width = predicate.w;
        this.canvas.height = predicate.h;

        // clear
        this.ctx.clearRect(0, 0, predicate.w, predicate.h);

        // draw image with correct position to put the predicate in the visible area of the canvas
        this.ctx.drawImage(origin, -predicate.x, -predicate.y);

        // create new image
        const image = new Image();
        image.src = this.canvas.toDataURL("image/png");
        return image;
    }
}
