import { Injectable } from "../../di/Injectable";
import { DimensionSize } from "../../constraint/Dimension";
import { ResourceError } from "../../exception/ResourceError";
import { TilePerspectiveRendering } from "../../render/util/TileRendering";
import { Vector } from "../../math/Vector";

@Injectable()
export class ImageChunkService {

    /**
     * the canvas to use for the chunking process
     */
    private canvas: HTMLCanvasElement = document.createElement("canvas");

    /**
     * the canvas context
     */
    private context: CanvasRenderingContext2D = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    /**
     * chunk all given images into one larger image. all images must have the same size
     * @param images all images that should be chunked
     * @param chunkSize the chunk or column size
     * @param renderer the renderer used to calculate drawing positions
     * @param imageSize the size of one image or auto (auto will get the size from the first image)
     */
    public chunkImages(
        images: HTMLImageElement[],
        chunkSize: number,
        renderer: TilePerspectiveRendering,
        imageSize: DimensionSize | "auto" = "auto"
    ): Promise<HTMLImageElement> {

        // get image dimension for the drawing process
        let imageDim: DimensionSize = imageSize as DimensionSize;
        if (imageSize === "auto") {
            const imageToGetSizeFrom = images[0];
            if (!imageToGetSizeFrom) {
                throw new ResourceError(`Images can not be chunked because the image to get the size from is undefined!`);
            }
            imageDim = {
                w: images[0].width,
                h: images[0].height
            } as DimensionSize;
        }

        // prepare canvas
        this.canvas.width = imageDim.w * chunkSize;
        this.canvas.height = imageDim.h * chunkSize;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // sort the data
        const yxData: HTMLImageElement[][] = [];

        let currentY: number = 0;
        let currentX: number = 0;
        images.forEach((image, index) => {

            // check y increment
            if (index % chunkSize === 0 && index > 0) {
                currentY += 1;
                currentX = 0;
            }

            // initialize x
            yxData[currentY] = yxData[currentY] || [];

            // add data
            yxData[currentY][currentX] = image;

            // increase x
            currentX += 1;
        });

        // get static offset for the given perspective
        const staticOffset = renderer.getOffset(yxData[0].length, yxData.length, imageDim.w, imageDim.h);

        // now iterate over the rows and cols
        yxData.forEach((column, y) => {
            column.forEach((image, x) => {

                // calculate the drawing position based on the perspective
                const drawingPosition = renderer
                    // translate to perspective
                    .getDrawingCoordinate(x, y, imageDim.w, imageDim.h)
                    // add static offset
                    .add(staticOffset);

                // draw image at new coordinates
                this.context.drawImage(image, drawingPosition.x, drawingPosition.y);
            });
        });

        // save this data
        // build the promise
        return new Promise<HTMLImageElement>((resolve, reject) => {

            // create the new image element
            const image = new Image();

            // set reject and resolve
            image.onerror = reject;
            image.onload = () => resolve(image);

            // finally copy the cropped image and await the load
            image.src = this.canvas.toDataURL("image/png");
        });
    }
}
