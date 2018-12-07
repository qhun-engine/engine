import { Rectangle } from "../../math/Rectangle";
import { Vector } from "../../math/Vector";
import { Shape } from "./Shape";

export class RectangleShape extends Rectangle implements Shape {

    /**
     * @inheritdoc
     */
    public contains(object: Vector): boolean {

        if (this.w <= 0 || this.h <= 0) {
            return false;
        }

        // test against object position
        if (object.x >= this.x && object.x < this.x + this.w) {
            if (object.y >= this.y && object.y < this.y + this.h) {
                return true;
            }
        }

        return false;
    }

    /**
     * @inheritdoc
     */
    public getBounds(): RectangleShape {

        return this;
    }
}
