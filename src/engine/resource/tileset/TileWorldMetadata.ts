export interface TileWorldLayerMetadata {

    /**
     * the tile numbers of this layer
     */
    data: number[];

    /**
     * height in tiles of this layer
     */
    height: number;

    /**
     * width in tiles of this layer
     */
    width: number;

    /**
     * identifier of this layer
     */
    id: string;

    /**
     * user defined name of this layer
     */
    name: string;

    /**
     * the opacity 0 (hidden) to 1(opaque) for this layer
     */
    opacity: number;

    /**
     * visibility of this layer true (is beeing rendered) false (not beeing rendered)
     */
    visible: boolean;

    /**
     * x offset in pixel for this layer
     */
    x: number;

    /**
     * y offset in pixel of this layer
     */
    y: number;
}

export interface TileWorldMetadata {

    /**
     * height in tiles of the world
     */
    height: number;

    /**
     * width in tiles of the world
     */
    width: number;

    /**
     * indicator that there are infinity possable tiles
     */
    infinite: boolean;

    /**
     * layered data of the world
     */
    layers: TileWorldLayerMetadata[];

    /**
     * the background color of the world in HEX RGBA
     */
    backgroundcolor: string;
}
