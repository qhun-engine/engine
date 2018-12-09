import { HasPosition } from "../constraint/HasPosition";
import { HasVelocity } from "../constraint/HasVelocity";
import { Vector } from "../math/Vector";

export class Particle implements HasPosition, HasVelocity {

    /**
     * current velocity of the particle
     */
    protected velocity: Vector = Vector.ZERO;

    /**
     * the lifetime at particle construction
     */
    protected originalLife: number;

    /**
     * the size of the particle at construction time
     */
    protected originalSize: number;

    /**
     * the current alpha channel change
     */
    protected alpha: number = 1;

    /**
     * a scalar color value to twean between two color states
     */
    protected deltaColor: [number, number, number, number] = [0, 0, 0, 0];

    /**
     * @param position current position of the particle
     * @param angle the current angle in radian
     * @param life the lifetime in milliseconds,
     * @param size the size in pixel of this particle
     * @param color the color of this particle. Format is [R, G, B, A]
     */
    constructor(
        protected position: Vector = Vector.ZERO,
        protected angle: number = 0,
        protected life: number = 0,
        protected size: number = 0,
        protected color: [number, number, number, number] = [0, 0, 0, 0]
    ) {

        // set original life
        this.originalLife = life;

        // set original size
        this.originalSize = size;
    }

    /**
     * @inheritdoc
     */
    public getPosition(): Vector {

        return this.position;
    }

    /**
     * @inheritdoc
     */
    public setPosition(position: Vector): this {

        this.position = position;
        return this;
    }

    /**
     * @inheritdoc
     */
    public getVelocity(): Vector {

        return this.velocity;
    }

    /**
     * @inheritdoc
     */
    public setVelocity(velocity: Vector): this {

        this.velocity = velocity;
        return this;
    }

    /**
     * get the current angle of this particle
     */
    public getAngle(): number {

        return this.angle;
    }

    /**
     * set the new angle of this particle
     * @param angle the new angle
     */
    public setAngle(angle: number): this {

        this.angle = angle;
        return this;
    }

    /**
     * set the new color of the particle
     * @param color the new color
     */
    public setColor(color: [number, number, number, number]): this {

        this.color = color;
        return this;
    }

    /**
     * get the current color of the particle
     */
    public getColor(): [number, number, number, number] {

        return this.color;
    }

    /**
     * set the new color delta of the particle
     * @param color the new color
     */
    public setColorDelta(delta: [number, number, number, number]): this {

        this.deltaColor = delta;
        return this;
    }

    /**
     * get the current delta color of the particle
     */
    public getColorDelta(): [number, number, number, number] {

        return this.deltaColor;
    }

    /**
     * get the current size of the particle
     */
    public getSize(): number {

        return this.size;
    }

    /**
     * set the new size of the particle
     * @param size the new size
     */
    public setSize(size: number): this {

        this.size = size;
        return this;
    }

    /**
     * get the current life time
     */
    public getLifeTime(): number {

        return this.life;
    }

    /**
     * set the new life time
     * @param life the new life time
     */
    public setLifeTime(life: number): this {

        this.life = life;
        return this;
    }
}
