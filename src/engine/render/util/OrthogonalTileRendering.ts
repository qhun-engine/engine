import { TilePerspectiveRendering } from "./TileRendering";
import { Vector } from "../../math/Vector";

export class OrthogonalTileRendering implements TilePerspectiveRendering {

    /**
     * @inheritdoc
     */
    public getDrawingCoordinate(x: number, y: number, tileWidth: number, tileHeight: number): Vector {

        // no point translation nessesary
        return Vector.from(x * tileWidth, y * tileHeight);
    }

    /**
     * @inheritdoc
     */
    public getOffset(xTileNumbers: number, yTileNumbers: number, tileWidth: number, tileHeight: number): Vector {

        // no offset nessesary
        return Vector.ZERO;
    }

    /**
     * @inheritdoc
     */
    public sortXAxis<T extends any>(data: T[]): T[] {

        // no sorting nessesary
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
