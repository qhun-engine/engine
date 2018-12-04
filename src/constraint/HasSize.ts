import { Vector } from "../math/Vector";

/**
 * a constraint interface that indicates that the implementing object has a size
 */
export interface HasSize {

    /**
     * get the size of the object
     */
    getSize(): Vector;

    /**
     * set the new size of the object
     * @param size the new size
     */
    setSize(size: Vector): ThisType<HasSize>;
}
