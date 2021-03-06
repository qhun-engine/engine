import { Clonable } from "../constraint/Clonable";
import { DimensionPosition } from "../constraint/Dimension";

export class Vector implements Clonable<Vector>, DimensionPosition {

    /**
     * zero based vector
     */
    public static readonly ZERO: Vector = new Vector(0, 0);

    /**
     * one based vector
     */
    public static readonly ONE: Vector = new Vector(1, 1);

    /**
     * a vector with (.5, .5)
     */
    public static readonly HALF: Vector = new Vector(.5, .5);

    /**
     * a vector that points up (0, -1)
     */
    public static readonly UP: Vector = new Vector(0, -1);

    /**
     * a vector that points down (0, 1)
     */
    public static readonly DOWN: Vector = new Vector(0, 1);

    /**
     * a vector that points left (-1, 0)
     */
    public static readonly LEFT: Vector = new Vector(-1, 0);

    /**
     * a vector that points right (-1, 0)
     */
    public static readonly RIGHT: Vector = new Vector(1, 0);

    /**
     * alias function for constructing the vector
     * @param x x part of the vector or a positioning object
     * @param y y part of the vector
     */
    public static from(x: number | DimensionPosition, y?: number): Vector {

        return new Vector(x, y);
    }

    /**
     * creates a vector from an angle in radian
     * @param angle the angle in radian
     */
    public static fromAngle(angle: number): Vector {

        return new Vector(Math.cos(angle), Math.sin(angle));
    }

    /**
     * x part of the vector
     */
    public x: number = 0;

    /**
     * y part of the vector
     */
    public y: number = 0;

    /**
     * @param x x part of the vector or a positioning object
     * @param y y part of the vector
     */
    constructor(
        x: number | DimensionPosition,
        y?: number
    ) {

        // test if x is a number or position
        if (typeof x === "object") {
            this.x = x.x;
            this.y = x.y;
        } else {

            // use x,y setup
            this.x = x as number;
            if (typeof y !== "number") {
                this.y = x as number;
            } else {
                this.y = y;
            }
        }
    }

    /**
     * adds the given vector to the current.
     * @param vector the vector to add
     */
    public add(vector: Vector | DimensionPosition): Vector {

        return new Vector(this.x + vector.x, this.y + vector.y);
    }

    /**
     * substracts the given vector from the current
     * @param vector the vector to substract
     */
    public substract(vector: Vector | DimensionPosition): Vector {

        return new Vector(this.x - vector.x, this.y - vector.y);
    }

    /**
     * divides the given vector from the current
     * @param vector the vector to divide
     */
    public divide(vector: Vector | DimensionPosition): Vector {

        return new Vector(this.x / vector.x, this.y / vector.y);
    }

    /**
     * multiply the current vector by given vector
     * @param vector the vector to multiply
     */
    public multiply(vector: Vector | DimensionPosition): Vector {

        return new Vector(this.x * vector.x, this.y * vector.y);
    }

    /**
     * calculate the direct distance to the given vector
     * @param vector the vector to calculate the distance to
     */
    public distance(vector: Vector = Vector.ZERO): number {

        return Math.sqrt(
            ((this.x - vector.x) ** 2) +
            ((this.y - vector.y) ** 2)
        );
    }

    /**
     * set the new x and y parts of this vector
     * @param x the new x part
     * @param y the new y part
     */
    public setXY(x: number, y: number): this {

        this.x = x;
        this.y = y;

        return this;
    }

    /**
     * get the magnitude (size) of this vector
     */
    public magnitude(): number {

        return this.distance();
    }

    /**
     * normalizes this vector to have a magnitude of 1
     */
    public normalize(): Vector {

        const currentDistance = this.distance();
        if (currentDistance > 0) {

            return new Vector(this.x / currentDistance, this.y / currentDistance);
        }

        return new Vector(0, 1);
    }

    /**
     * calculates the average (midpoint) vector from this to another vector.
     * @param vector the other vector for the average calculation
     */
    public average(vector: Vector): Vector {

        return this.add(vector)
            .scale(.5);
    }

    /**
     * scales this vector by the given scale size
     * @param scale the scale size
     */
    public scale(scale: number): Vector {

        return new Vector(this.x * scale, this.y * scale);
    }

    /**
     * returns the angle of this vector in radian
     */
    public getAngle(): number {

        return Math.atan2(this.y, this.x);
    }

    /**
     * removes negative signs from components using Math.abs()
     */
    public abs(): Vector {

        return new Vector(Math.abs(this.x), Math.abs(this.y));
    }

    /**
     * multiply the vector by (0.5, 0.5)
     */
    public half(): Vector {

        return this.multiply(Vector.HALF);
    }

    /**
     * square the vector
     */
    public square(): Vector {

        return this.multiply(this.clone());
    }

    /**
     * multiplies the vector by (2, 2)
     */
    public double(): Vector {

        return this.multiply(Vector.from(2));
    }

    /**
     * check if the given vector equals the current vector with optional tolerance
     * @param vector the vector to compare with
     */
    public equals(vector: Vector, tolerance: number = 0.0001): boolean {

        /* faster implementation

        return Math.abs(this.x - vector.x) <= tolerance &&
            Math.abs(this.y - vector.y) <= tolerance;*/

        return this.substract(vector).abs().magnitude() <= tolerance;
    }

    /**
     * test if the vector is pointing right
     */
    public isPointingRight(): boolean {

        return this.x > 0;
    }

    /**
     * test if the vector is pointing left
     */
    public isPointingLeft(): boolean {

        return this.x < 0;
    }

    /**
     * test if the vector is pointing up
     */
    public isPointingUp(): boolean {

        return this.y < 0;
    }

    /**
     * test if the vector is pointing up
     */
    public isPointingDown(): boolean {

        return this.y > 0;
    }

    /**
     * @inheritdoc
     */
    public clone(): Vector {
        return new Vector(this.x, this.y);
    }

    /**
     * @override
     */
    public toString(): string {

        return `${Vector.name}[${this.x}, ${this.y}]`;
    }

}
