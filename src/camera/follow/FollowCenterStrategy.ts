import { CameraFollowStrategy } from "./CameraFollowStrategy";
import { Followable } from "./Followable";
import { Vector } from "../../math/Vector";
import { Camera } from "../Camera";

/**
 * a camera follow strategy to center the followed object
 */
export class FollowCenterStrategy<T extends Followable> implements CameraFollowStrategy<T> {

    /**
     * @inheritdoc
     */
    public process(target: T, camera: Camera, delta: number): Vector {

        // get centeres position of the followed target
        return target.getCenter();
    }
}
