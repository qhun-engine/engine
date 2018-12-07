import { CameraFollowStrategy } from "./CameraFollowStrategy";
import { Followable } from "./Followable";
import { Camera } from "../Camera";
import { Vector } from "../../math/Vector";

export class FollowAverageCenterStrategy<T extends Followable> implements CameraFollowStrategy<T> {

    /**
     * @param otherFollowable the other followable object to get the distance from
     */
    constructor(
        private otherFollowable: T
    ) { }

    /**
     * @inheritdoc
     */
    public process(target: T, camera: Camera, delta: number): Vector {

        // get center of both followable objects and
        // calculate the average (middle) point
        return target.getCenter().average(
            this.otherFollowable.getCenter()
        );
    }
}
