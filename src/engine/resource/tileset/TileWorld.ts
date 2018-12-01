import { DimensionSize } from "../../constraint/Dimension";

export interface TileWorld {

    /**
     * get the size of the world in tiles
     */
    getWorldSize(): DimensionSize;

    /**
     * get the tile image from the tileset by specifing the position of the tile
     * @param layer the layer number
     * @param x the x offset in tiles
     * @param y the y offset in tiles
     */
    getTileImageByCoordinate(layer: number, x: number, y: number): HTMLImageElement;
}
