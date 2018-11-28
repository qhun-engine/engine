import { DimensionSize, DimensionPosition } from "../constraint/Dimension";

export interface PixiJSAnimationData {

    /**
     * contains every frame of the animation
     */
    frames: {
        [pictureName: string]: {

            /**
             * contains positioning data in the sprite image
             */
            frame: DimensionSize & DimensionPosition,

            /**
             * is the image rotated?
             */
            rotated: boolean,

            /**
             * is the image trimmed?
             */
            trimmed: boolean,

            /**
             * final sprite size
             */
            spriteSourceSize: DimensionSize & DimensionPosition,

            /**
             * unknown
             */
            sourceSize: DimensionSize
        }
    };

    /**
     * optional metadata for this animation
     */
    meta: {

        /**
         * the app that created the json file
         */
        app: string;

        /**
         * version of the app
         */
        version: string;

        /**
         * name of the final image containing the different sub images
         */
        image: string;

        /**
         * sprint generation format
         */
        format: "RGBA8888"

        /**
         * overall sprite image size
         */
        size: DimensionSize
    };

}
