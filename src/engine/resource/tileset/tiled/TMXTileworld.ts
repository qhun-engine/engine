import { WorldPerspective } from "../../../world/WorldPerspective";

declare type TMXTileset = {

    /**
     * the first tile id of this tileset
     */
    __firstgid: number,

    /**
     * the TSX tileset source file name
     */
    __source: string,

};

/**
 * a tileworld parsed from xml to json in the .TMX format
 */
export interface TMXTileworld {

    /**
     * contains world/map data
     */
    map: {

        /**
         * the height of the world in tiles
         */
        __height: number,

        /**
         * the width of the world in tiles
         */
        __width: number,

        /**
         * defines if the world is infinite
         */
        __infinite: boolean | number,

        /**
         * the index of the next layer that may be created
         */
        __nextlayerid: number,

        /**
         * the index of the next object that may be created
         */
        __nextobjectid: number,

        /**
         * the map type type
         */
        __orientation: WorldPerspective.ORTHOGONAL | WorldPerspective.ISOMETRIC | WorldPerspective.HEXAGONAL,

        /**
         * the desired rendering order
         */
        __renderorder: "right-down" | "right-up" | "left-down" | "left-up",

        /**
         * unknown
         */
        __staggeraxis: "y" | "x",

        /**
         * unknown
         */
        __staggerindex: "even" | "odd",

        /**
         * the editor version of tiled
         */
        __tiledversion?: string,

        /**
         * height of one tile in pixel
         */
        __tileheight: number,

        /**
         * width of one tile in pixel
         */
        __tilewidth: number,

        /**
         * version of the TMX format
         */
        __version: number,

        /**
         * defined the external tileset used in this world
         */
        tileset: TMXTileset | TMXTileset[],

        /**
         * defined the layer data
         */
        layer: {

            /**
             * internal layer id, lower numbers are drawn first
             */
            __id: number,

            /**
             * user defined name of this layer
             */
            __name: string,

            /**
             * the width of the layer in tiles
             */
            __width: number,

            /**
             * the height of the layer in tiles
             */
            __height: number,

            /**
             * contains the ids of tiles that represent this layer
             */
            data: {

                /**
                 * xml wrapper for all tiles in this layer
                 */
                tile: {

                    /**
                     * the id of the tile in the tileset
                     */
                    __gid: number
                }[]
            }
        }[]
    };
}
