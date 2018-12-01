import { Injectable } from "../../di/Injectable";
import { DimensionSize } from "../../constraint/Dimension";
import { ResourceError } from "../../exception/ResourceError";

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
     * @param imageSize the size of one image or auto (auto will get the size from the first image)
     */
    public chunkImages(images: HTMLImageElement[], chunkSize: number, imageSize: DimensionSize | "auto" = "auto"): Promise<HTMLImageElement> {

        // get image dimension for the drawing process
        let imageDim = imageSize;
        if (imageDim === "auto") {
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

        // iterate over the images
        let currentX = 0;
        let currentY = 0;
        images.forEach((image, index) => {

            // check y adjust
            if (index % chunkSize === 0 && index > 0) {

                // adjust y
                currentY += (imageDim as DimensionSize).h;
                // reset x
                currentX = 0;
            }

            // draw the image if available
            if (image) {
                this.context.drawImage(image, currentX, currentY);
            }

            // increase the currentX
            currentX += (imageDim as DimensionSize).w;
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
