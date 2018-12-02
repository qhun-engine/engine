import { HasPosition } from "./HasPosition";
import { HasSize } from "./HasSize";
import { Vector } from "../math/Vector";

/**
 * a constraint interface that indicates that the implementing object has a center coordinate
 */
export interface HasCenter extends HasPosition, HasSize {

    /**
     * get the center coordinate of the object
     */
    getCenter(): Vector;
}
