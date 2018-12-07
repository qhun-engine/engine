import { Vector } from "../../math/Vector";
import { RectangleShape } from "./RectangleShape";
import { Shape } from "./Shape";

export class CircleShape implements Shape {

    /**
     * @param x the x position of this circle
     * @param y the y position of this circle
     * @param radius the radius of this circle
     */
    constructor(
        public x: number,
        public y: number,
        public radius: number
    ) { }

    /**
     * @inheritdoc
     */
    public contains(object: Vector): boolean {

        // check radius first
        if (this.radius <= 0) {
            return false;
        }

        // make the test
        const deltaVector = Vector
            .from(this.x - object.x, this.y - object.y)
            .double();

        return (deltaVector.x + deltaVector.y <= this.radius ** 2);
    }

    /**
     * @inheritdoc
     */
    public getBounds(): RectangleShape {

        return new RectangleShape(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }

    /**
     * @inheritdoc
     */
    public clone(): CircleShape {

        return new CircleShape(this.x, this.y, this.radius);
    }
}
