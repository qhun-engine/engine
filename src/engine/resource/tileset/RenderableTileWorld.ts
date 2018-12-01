import { DimensionSize } from "../../constraint/Dimension";
import { TileworldPerspective } from "./TileworldPerspective";

export interface RenderableTileWorld {

    /**
     * get the rendering perspective
     */
    getTileWorldPerspective(): TileworldPerspective;

    /**
     * get the size of the world in tiles
     */
    getWorldSize(): DimensionSize;

    /**
     * get the amount of layers in this world
     */
    getLayerCount(): number;

    /**
     * get the dimension of one tile in pixel
     */
    getTileDimension(): DimensionSize;

    /**
     * get the tile image from the tileset by specifing the position of the tile
     * @param layer the layer number
     * @param x the x offset in tiles
     * @param y the y offset in tiles
     */
    getTileImageByCoordinate(layer: number, x: number, y: number): HTMLImageElement;
}
