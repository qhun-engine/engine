import { Renderable } from "../constraint/Renderable";
import { ImageResource } from "../resource/sprite/ImageResource";
import { HasPosition } from "../constraint/HasPosition";
import { Vector } from "../math/Vector";

export class Tile implements Renderable, HasPosition {

    /**
     * the current position of this tile. cartesian coordinate system in tile numbers!
     */
    protected position: Vector = Vector.ZERO;

    /**
     * the current texture of the tile
     */
    protected texture!: ImageResource;

    /**
     * @inheritdoc
     */
    public getTexture(): ImageResource {

        return this.texture;
    }

    /**
     * @inheritdoc
     */
    public setTexture(texture: ImageResource): this {

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
}
