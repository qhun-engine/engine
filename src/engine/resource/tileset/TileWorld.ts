import { TileMapResource } from "./TileMapResource";
import { TileWorldResource } from "./TileWorldResource";
import { ImageResource } from "../sprite/ImageResource";
import { Vector } from "../../math/Vector";

/**
 * a tilemap based world that used the `TileMapResource` as a resource for different tiles and
 * a `TileWorldResource` for the individual world generation
 */
export abstract class TileWorld {

    constructor(
        protected tileMap: TileMapResource,
        protected tileWorld: TileWorldResource
    ) { }

    /**
     * get the tile number at the given position
     * @param position the position of the tile
     * @param layer the layer number. defaults to 0
     */
    public getTileAtPosition(position: Vector, layer: number = 0): number | undefined {

        return this.tileWorld.getData().layers[layer].data[position.x + this.tileWorld.getData().width * position.y];
    }

    /**
     * get a tile from the `TileMapResource` by number
     * @param tileNumber the tile number
     */
    public getTileByNumber(tileNumber: number): ImageResource | undefined {

        return this.tileMap.getTileImages()[tileNumber - 1];
    }

    /**
     * get the size of the world in pixel
     */
    public getWorldSize(): Vector {

        return Vector.from(
            this.tileWorld.getData().width,
            this.tileWorld.getData().height
        );
    }

    /**
     * get the layer count of the world
     */
    public getWorldLayerCount(): number {

        return this.tileWorld.getData().layers.length;
    }

    /**
     * get the tile dimension for this world
     */
    public getTileDimension(): Vector {

        return Vector.from(
            this.tileMap.getTileMapMetadata().tilewidth,
            this.tileMap.getTileMapMetadata().tileheight
        );
    }

}
