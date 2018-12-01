declare type TSXProperty = {

    /**
     * name of the property
     */
    __name: string,

    /**
     * the type of the value. can be empty, in this case, the type is a string
     */
    __type?: "bool" | "int" | "file" | "float" | "color",

    /**
     * the value of the property (can be boolean, string, number ...)
     */
    __value: any
};

/**
 * a tileset parsed from xml to json in the .TSX format
 */
export interface TSXTileset {

    /**
     * contains information about this tileset
     */
    tileset: {

        /**
         * the amount of columns in this tileset
         */
        __columns: number,

        /**
         * user defined name of this tileset
         */
        __name: string,

        /**
         * sum of all tile pictures in this tileset
         */
        __tilecount: number,

        /**
         * the version of the tiled editor used to create this resource
         */
        __tiledversion?: string,

        /**
         * height in px of one tile
         */
        __tileheight: number,

        /**
         * width in px of one tile
         */
        __tilewidth: number,

        /**
         * version of the TSX format
         */
        __version: number,

        /**
         * the outer margin of the tileset image
         */
        __margin?: number,

        /**
         * the spacing in px between each tile
         */
        __spacing?: number,

        /**
         * declares the image used with this tileset
         */
        image?: {

            /**
             * height of the image in px
             */
            __height: number,

            /**
             * the filename of the image
             */
            __source: string,

            /**
             * width of the image in px
             */
            _width: number
        },

        /**
         * contains information about tile properties
         */
        tile?: {

            /**
             * the gid of the tile
             */
            __id: number,

            /**
             * a tile that contains a single image
             */
            image?: {

                /**
                 * height of the image in px
                 */
                __height: number,

                /**
                 * the filename of the image
                 */
                __source: string,

                /**
                 * width of the image in px
                 */
                _width: number
            },

            /**
             * xml wrapper object for properties
             */
            properties: {

                /**
                 * contains one or more tile properties
                 */
                property: TSXProperty | TSXProperty[]

            }
        }[]
    };
}
