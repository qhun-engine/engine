export interface CameraFollowStrategy<Target> {

    /**
     * returns the target that should be centered by the camera
     */
    getTarget(): Target;
}
