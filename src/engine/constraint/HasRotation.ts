/**
 * a constraint interface that indicates that the implementing object has a rotation
 */
export interface HasRotation {

    /**
     * get the current rotation in radians
     */
    getRotation(): number;

    /**
     * set the new rotation in radians
     * @param rotation the new rotation in radians
     */
    setRotation(rotation: number): ThisType<HasRotation>;
}
