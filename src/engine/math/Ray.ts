import { Vector } from "./Vector";

export class Ray {

    /**
     * @param position the position of the raycast
     * @param direction the direction of the raycast
     */
    constructor(
        public position: Vector,
        public direction: Vector
    ) {

        // normalize the direction
        this.direction = this.direction.normalize();
    }
}
