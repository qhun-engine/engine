import { TilePerspectiveRendering } from "./TileRendering";
import { Vector } from "../../math/Vector";

export class IsometricTileRendering implements TilePerspectiveRendering {

    /**
     * @inheritdoc
     */
    public getDrawingCoordinate(x: number, y: number, tileWidth: number, tileHeight: number): Vector {

        // cartesian to isometric transform
        const isoX = (x - y) * (tileWidth / 2);
        const isoY = (x + y) * (tileHeight / 2);

        return Vector.from(
            Math.floor(isoX),
            Math.floor(isoY)
        );
    }

    /**
     * @inheritdoc
     */
    public getOffset(xTileNumbers: number, yTileNumbers: number, tileWidth: number, tileHeight: number): Vector {

        return Vector.from(
            (xTileNumbers / 2) * tileWidth,
            (yTileNumbers / 2) * (tileHeight / 2)
        );
    }

    /**
     * @inheritdoc
     */
    public sortXAxis<T extends any>(data: T[]): T[] {

        // x axis must be reversed
        return data;
    }

    /**
     * @inheritdoc
     */
    public sortYAxis<T extends any>(data: T[]): T[] {

        // no sorting nessesary
        return data;
    }
}
