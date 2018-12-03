import { Injectable } from "../../di/Injectable";
import { WorldPerspective } from "../../world/WorldPerspective";
import { TilePerspectiveRendering } from "./TileRendering";
import { OrthogonalTileRendering } from "./OrthogonalTileRendering";
import { IsometricTileRendering } from "./IsometricTileRendering";
import { RenderingError } from "../../exception/RenderingError";

/**
 * a util class that constructs rendering implementations for different projection types
 */
@Injectable()
export class TilePerspectiveRenderingFactory {

    /**
     * create a tile renderer for the given perspective
     * @param perspective the perspective
     */
    public createByPerspective(perspective: WorldPerspective): TilePerspectiveRendering {

        if (perspective === WorldPerspective.ORTHOGONAL) {

            // draw using orthogonal algorithm
            return new OrthogonalTileRendering();
        } else if (perspective === WorldPerspective.ISOMETRIC) {

            // draw using isometric algorithm
            return new IsometricTileRendering();
        }

        // perspective not supported!
        throw new RenderingError(`No renderer found for the given perspective ${perspective}!`);
    }
}
