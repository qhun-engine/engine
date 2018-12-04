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
    public getTranslatedPosition(x: number, y: number, tileWidth: number, tileHeight: number): Vector {

        // no translation nessesary
        return this.getDrawingCoordinate(
            x / tileWidth, x / tileHeight,
            tileWidth, tileHeight
        );
    }

    /**
     * @inheritdoc
     */
    public getOffset(xTileNumbers: number, yTileNumbers: number, tileWidth: number, tileHeight: number): Vector {

        return Vector.from(
            ((xTileNumbers / 2) * tileWidth) - tileWidth / 2,
            -tileHeight
        );
    }
}
