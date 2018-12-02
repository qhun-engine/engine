import { Vector } from "../math/Vector";

/**
 * a constraint interface that indicates that the implementing object has a dedicated position
 */
export interface HasPosition {

    /**
     * get the position of this object
     */
    getPosition(): Vector;

    /**
     * set the new position for this object
     * @param position the new position
     */
    setPosition(position: Vector): ThisType<HasPosition>;
}
