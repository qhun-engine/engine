import { CameraFollowStrategy } from "./CameraFollowStrategy";
import { Followable } from "./Followable";
import { Vector } from "../../math/Vector";
import { Camera } from "../Camera";

/**
 * a camera follow strategy to center the followed object
 */
export class FollowElasticCenterStrategy<T extends Followable> implements CameraFollowStrategy<T> {

    /**
     * @param elasticity value from 0 to 1. adds force to camera velocity
     * @param friction value from 0 to 1. adds resistance to camera velocity
     */
    constructor(
        private elasticity: number,
        private friction: number
    ) { }

    /**
     * @inheritdoc
     */
    public process(target: T, camera: Camera, delta: number): Vector {

        // get target centered position
        const centerPosition = target.getCenter();

        // get camera position
        const cameraPosition = camera.getPosition();

        // get current camera velocity
        let cameraVelocity = camera.getVelocity();

        // add the elasticity to a new camera velocity applying the spring equation of hooks law
        const strech = centerPosition.substract(cameraPosition).scale(this.elasticity);

        // add the streched velocity to the current camera velocity
        cameraVelocity = cameraVelocity.add(strech);

        // calculate the friction
        const friction = cameraVelocity.scale(-1).scale(this.friction);

        // add the friction to the current calculated velocity
        cameraVelocity = cameraVelocity.add(friction);

        // add the calculated velocity to the current camera position
        return cameraPosition.add(cameraVelocity);
    }
}
