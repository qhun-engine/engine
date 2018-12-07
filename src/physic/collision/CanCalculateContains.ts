import { Vector } from "../../math/Vector";

export interface CanCalculateContains {

    /**
     * check if this object contains an other object with the given position
     * @param object the other object to test
     */
    contains(object: Vector): boolean;
}
