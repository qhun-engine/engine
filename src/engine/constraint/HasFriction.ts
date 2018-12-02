/**
 * a constraint interface that indicates that the implementing object has friction
 */
export interface HasFriction {

    /**
     * set the new friction of the object 0 to 1
     * @param speed the new friction of the object
     */
    setFriction(speed: number): ThisType<HasFriction>;

    /**
     * get the friction of the object 0 to 1
     */
    getFriction(): number;
}
