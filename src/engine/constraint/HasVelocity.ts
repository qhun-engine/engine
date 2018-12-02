import { Vector } from "../math/Vector";

/**
 * a constraint interface that indicates that the implementing object has a velocity
 */
export interface HasVelocity {

    /**
     * get the velocity of this object
     */
    getVelocity(): Vector;

    /**
     * set the new velocity for this object
     * @param velocity the new velocity
     */
    setVelocity(velocity: Vector): ThisType<HasVelocity>;
}
