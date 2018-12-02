import { Vector } from "../math/Vector";

/**
 * a constraint interface that indicates that the implementing object has an anchor
 */
export interface HasAnchor {

    /**
     * get the anchor point of this object
     */
    getAnchor(): Vector;

    /**
     * set the anchor point for this object
     * @param anchor the new anchor point
     */
    setAnchor(anchor: Vector): ThisType<HasAnchor>;
}
