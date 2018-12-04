/**
 * a constraint interface that indicates that the implementing object has speed
 */
export interface HasSpeed {

    /**
     * set the new speed of the object in pixel per second
     * @param speed the new speed in pixel per second
     */
    setSpeed(speed: number): ThisType<HasSpeed>;

    /**
     * get the new speed of the object in pixel per second
     */
    getSpeed(): number;
}
