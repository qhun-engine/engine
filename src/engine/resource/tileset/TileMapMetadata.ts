export interface TileMapMetadata {

    /**
     * the number of columns in the tileset
     */
    columns: number;

    /**
     * the tileset image name
     */
    image: string;

    /**
     * total image height
     */
    imageheight: number;

    /**
     * total image width
     */
    imagewidth: number;

    /**
     * the amount of margin (outer space) of the tileset
     */
    margin: number;

    /**
     * the name of the tileset
     */
    name: string;

    /**
     * the padding between each tile
     */
    spacing: number;

    /**
     * total amount of times in this map
     */
    tilecount: number;

    /**
     * height of one tile
     */
    tileheight: number;

    /**
     * width of one tile
     */
    tilewidth: number;

}
