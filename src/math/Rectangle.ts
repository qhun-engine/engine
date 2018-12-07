import { DimensionPosition, DimensionSize } from "../constraint/Dimension";
import { Vector } from "./Vector";
import { Clonable } from "../constraint/Clonable";

/**
 * a rectangle based util class
 */
export class Rectangle implements DimensionPosition, DimensionSize, Clonable<Rectangle> {

    /**
     * the right point of this rectangle
     */
    public right: number = this.x + this.w;

    /**
     * the bottom point of this rectangle
     */
    public bottom: number = this.y + this.h;

    /**
     * @param x the x coordinate (or left offset)
     * @param y the y coordonate (or top offset)
     * @param w the width of the rectangle
     * @param h the height of the rectangle
     */
    constructor(
        public x: number,
        public y: number,
        public w: number,
        public h: number
    ) { }

    /**
     * check if this rectangle is within the given rectangle
     * @param rect the other rectangle
     */
    public within(rect: Rectangle): boolean {

        return rect.x <= this.x && rect.right >= this.right && rect.y <= this.y && rect.bottom >= this.bottom;
    }

    /**
     * check if this rectangle overlaps the given rectangle
     * @param rect the other rectangle
     */
    public overlaps(rect: Rectangle): boolean {

        return this.x < rect.right && rect.x < this.right && this.y < rect.bottom && rect.y < this.bottom;
    }

    /**
     * updates the internal values within one function
     * @param x the x coordinate (or left offset)
     * @param y the y coordonate (or top offset)
     * @param w the width of the rectangle
     * @param h the height of the rectangle
     */
    public set(x: number, y: number, w?: number, h?: number): this {

        this.x = x;
        this.y = y;

        this.w = typeof w === "undefined" ? this.w : w;
        this.h = typeof h === "undefined" ? this.h : h;

        // update bottom and right
        this.bottom = this.y + this.h;
        this.right = this.x + this.w;

        return this;
    }

    /**
     * transforms partials of the rectangle into a vector
     * @param pairs the pairs of the rectangle to put into the vector
     */
    public toVector(pairs: "xy" | "wh" = "xy"): Vector {

        if (pairs === "xy") {
            return Vector.from(this.x, this.y);
        } else {
            return Vector.from(this.w, this.h);
        }
    }

    /**
     * @override
     */
    public toString(): string {

        return `${Rectangle.name}[${this.x}, ${this.y}]`;
    }

    /**
     * @inheritdoc
     */
    public clone(): Rectangle {

        return new Rectangle(this.x, this.y, this.w, this.h);
    }
}
