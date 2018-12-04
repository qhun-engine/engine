import { Injectable } from "@qhun-engine/base";

import { Rectangle } from "../../math/Rectangle";

/**
 * a service that can extract parts of an image
 */
@Injectable()
export class ImageCropService {

    /**
     * the canvas to use for the extraction process
     */
    private canvas: HTMLCanvasElement = document.createElement("canvas");

    /**
     * the canvas context
     */
    private context: CanvasRenderingContext2D = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    /**
     * extracts the given rectangle from the origin image
     * @param originalImage the original image
     * @param rectangle the rectangle to get the new image of
     */
    public async extractFromImage(originalImage: HTMLImageElement, rectangle: Rectangle): Promise<HTMLImageElement> {

        // prepare the canvas
        this.prepareCanvas(rectangle.w, rectangle.h);

        // draw the complete image with the new image in the visible area
        this.context.drawImage(originalImage, -rectangle.x, -rectangle.y);

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

    /**
     * extracts the given rectangles from the origin image
     * @param originalImage the original image
     * @param rectangles the rectangles to get the new image of
     */
    public async extractMultipleFromImage(originalImage: HTMLImageElement, rectangles: Rectangle[]): Promise<HTMLImageElement[]> {

        return Promise.all(rectangles.map(
            rect => this.extractFromImage(originalImage, rect)
        ));
    }

    /**
     * prepares the internal canvas to be ready for the given data
     * @param width the new width
     * @param height the new height
     */
    private prepareCanvas(width: number, height: number): void {

        this.canvas.width = width;
        this.canvas.height = height;

        // now clear the canvas
        this.context.clearRect(0, 0, width, height);
    }
}
