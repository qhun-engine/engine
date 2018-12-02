import { Vector } from "../math/Vector";
import { HasVelocity } from "./HasVelocity";
import { HasSpeed } from "./HasSpeed";

/**
 * a constraint interface that indicates that the implementing object can move to the given position
 */
export interface CanMove extends HasVelocity, HasSpeed {

    /**
     * move the object to the given position on the map using its own speed
     * @param position the target position on the map
     */
    move(position: Vector): ThisType<CanMove>;
}
