import { CameraFollowStrategy } from "./CameraFollowStrategy";
import { Followable } from "./Followable";
import { Camera } from "../Camera";
import { Vector } from "../../math/Vector";
import { FollowElasticCenterStrategy } from "./FollowElasticCenterStrategy";

export class FollowElasticAverageCenterStrategy<T extends Followable> extends FollowElasticCenterStrategy<T> implements CameraFollowStrategy<T> {

    /**
     * @param otherFollowable the other followable object to get the distance from
     */
    constructor(
        private otherFollowable: T,
        elasticity: number,
        friction: number
    ) {

        super(elasticity, friction);
    }

    /**
     * @inheritdoc
     */
    public process(target: T, camera: Camera, delta: number): Vector {

        // get center of both followable objects and
        // calculate the average (middle) point
        return super.process(target, camera, delta).average(target.getCenter().average(
            this.otherFollowable.getCenter()
        ));
    }
}
