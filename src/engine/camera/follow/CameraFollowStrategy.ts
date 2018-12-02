import { Vector } from "../../math/Vector";
import { Followable } from "./Followable";
import { Camera } from "../Camera";

export interface CameraFollowStrategy<T extends Followable> {

    /**
     * calculates a new position based vector for the camera
     * @param target the target to follow
     * @param camera the current camera following the target entity
     * @param delta the time in milliseconds passed since the last update
     */
    process(target: T, camera: Camera, delta: number): Vector;
}
