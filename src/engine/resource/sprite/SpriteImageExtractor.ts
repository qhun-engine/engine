import { Injectable } from "../../di/Injectable";
import { SpriteResource } from "./SpriteResource";
import { DimensionSize } from "../../constraint/Dimension";
import { ImageResource } from "./ImageResource";
import { ImageCropService } from "../util/ImageCropService";
import { Rectangle } from "../../math/Rectangle";

interface SpriteDecoupleResult extends DimensionSize {

    /**
     * name/number of the picture
     */
    name: string | number;

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

    constructor(
        private cropService: ImageCropService
    ) { }

    /**
     * extracts all images from the sprite sheet using the given metadata
     * @param sprite the sprite to get the data from
     */
    public async extractImagesFromSpriteSheet(sprite: SpriteResource): Promise<SpriteDecoupleResult[]> {

        const convertPromiseStack: Promise<SpriteDecoupleResult>[] = [];

        // iterate over every possible sub file
        const frames = sprite.getAnimation().frames;
        Object.keys(frames).forEach(frameName => {

            const frameData = frames[frameName];

            // convert this frame into an image
            const rect = new Rectangle(frameData.frame.x, frameData.frame.y, frameData.frame.w, frameData.frame.h);
            convertPromiseStack.push(this.cropService.extractFromImage(sprite.getData(), rect).then(imageData => {
                return {
                    name: frameName,
                    image: (new ImageResource("@internal:canvas", "@internal:canvas")).setData(imageData)
                } as SpriteDecoupleResult;
            }));
        });

        return Promise.all(convertPromiseStack);
    }
}
