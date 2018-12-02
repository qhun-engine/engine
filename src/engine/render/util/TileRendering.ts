import { Vector } from "../../math/Vector";

export interface TilePerspectiveRendering {

    /**
     * get the translated position for the given x,y point keeping the perspective in mind
     * @param x the x tile number
     * @param y the y tile number
     * @param tileWidth the width in px of one tile
     * @param tileHeight the height in px of one tile
     */
    getDrawingCoordinate(x: number, y: number, tileWidth: number, tileHeight: number): Vector;

    /**
     * get the translated position keeping the perspective in mind
     * @param x the x position
     * @param y the y position
     * @param tileWidth the width in px of one tile
     * @param tileHeight the height in px of one tile
     */
    getTranslatedPosition(x: number, y: number, tileWidth: number, tileHeight: number): Vector;

    /**
     * calculates the nessesary offset for the tiles to be visible while translating positions into other perspectives
     * @param xTileNumbers the amount of tiles on the x axis
     * @param yTileNumbers the amount of tiles on the y axis
     * @param tileWidth the width of one tile in pixel
     * @param tileHeight the height of one tile in pixel
     */
    getOffset(xTileNumbers: number, yTileNumbers: number, tileWidth: number, tileHeight: number): Vector;

}
