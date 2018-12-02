import { Vector } from "./Vector";
import { Tileworld } from "../resource/tileset/Tileworld";

export class Ray {

    /**
     * @param position the position of the raycast on the viewport
     * @param cartesianPosition the engine internal cartesian position of the map
     * @param mapPosition the world map position included calculated perspective transform
     * @param world the world where the ray should be casted in
     */
    constructor(
        private input: Vector,
        private cartesianPosition: Vector,
        private mapPosition: Vector,
        private world: Tileworld
    ) { }

    /**
     * get the map position where the ray hits the ground
     */
    public getMapPosition(): Vector {

        return this.mapPosition;
    }

    /**
     * get the engine internal cartesian map position
     */
    public getCartesianMapPosition(): Vector {

        return this.cartesianPosition;
    }
}
