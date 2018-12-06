import { Renderable } from "../constraint/Renderable";
import { HasPosition } from "../constraint/HasPosition";
import { Vector } from "../math/Vector";
import { TileProperties } from "./TileProperties";

export class Tile<P extends TileProperties = TileProperties> implements Renderable, HasPosition {

    /**
     * the current position of this tile. cartesian coordinate system in tile numbers!
     */
    protected position: Vector = Vector.ZERO;

    /**
     * the current texture of the tile
     */
    protected texture!: HTMLImageElement;

    /**
     * all properties for this tile
     */
    protected properties: {
        [T in keyof P]?: P[T]
    } = {};

    /**
     * indicator that this tile is animated
     */
    protected animationFlag: boolean = false;

    /**
     * @inheritdoc
     */
    public getTexture(): HTMLImageElement {

        return this.texture;
    }

    /**
     * @inheritdoc
     */
    public setTexture(texture: HTMLImageElement): this {

        this.texture = texture;
        return this;
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
     * set a property for this tile
     * @param name the name of the property
     * @param value the value of the property
     */
    public setProperty<T extends keyof P>(name: T, value: P[T]): this {

        this.properties[name] = value;
        return this;
    }

    /**
     * get a property by name of this tile
     * @param name the name of the property
     */
    public getProperty<T extends keyof P>(name: T): P[T] | undefined {

        return this.properties[name];
    }

    /**
     * set the tile to animated
     * @param animatedFlag the new animation flag
     */
    public setHasAnimaion(animatedFlag: boolean): this {

        this.animationFlag = animatedFlag;
        return this;
    }

    /**
     * check if this tile has animations
     */
    public hasAnimation(): boolean {

        return this.animationFlag;
    }
}
