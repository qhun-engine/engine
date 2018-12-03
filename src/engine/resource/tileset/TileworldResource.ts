import { BaseResource } from "../BaseResource";
import { TMXTileworld } from "./tiled/TMXTileworld";
import { XmlTextResource } from "../text/XmlTextResource";
import { TilesetResource } from "./TilesetResource";
import { Injector } from "../../di/Injector";
import { ResourceLoader } from "../ResourceLoader";
import { RenderableWorld } from "../../world/RenderableWorld";
import { DimensionSize } from "../../constraint/Dimension";
import { LayeredWorldProperties } from "./LayeredWorldProperties";
import { WorldPerspective } from "../../world/WorldPerspective";

/**
 * a tile world wraped by a resource context
 */
export class TileworldResource<T extends XmlTextResource<TMXTileworld> = XmlTextResource<TMXTileworld>> extends BaseResource<T> implements RenderableWorld {

    /**
     * world data with specific tile gid
     */
    protected world: LayeredWorldProperties = [];

    /**
     * the world data with rendered tile image
     */
    protected generatedWorld: LayeredWorldProperties<HTMLImageElement> = [];

    /**
     * used tilesets in this world
     */
    protected tilesets: {

        /**
         * the actual resource
         */
        tileset: TilesetResource,

        /**
         * the first gid of this tileset
         */
        firstgid: number
    }[] = [];

    /**
     * @inheritdoc
     */
    public getWorldSize(): DimensionSize {

        return {
            w: this.data.getData().map.__width,
            h: this.data.getData().map.__height
        };
    }

    /**
     * get the world as tile number[][][]
     */
    public getWorldLayout(): LayeredWorldProperties {
        return this.world;
    }

    /**
     * @inheritdoc
     */
    public getLayerCount(): number {

        return this.world.length;
    }

    /**
     * @inheritdoc
     */
    public getTileDimension(): DimensionSize {

        return { w: this.data.getData().map.__tilewidth, h: this.data.getData().map.__tileheight };
    }

    /**
     * @inheritdoc
     */
    public getTileImageByCoordinate(layer: number, x: number, y: number): HTMLImageElement {

        // first get the tile number
        return this.generatedWorld[layer].xy[x][y];
    }

    /**
     * @inheritdoc
     */
    public getWorldPerspective(): WorldPerspective {

        return this.data.getData().map.__orientation;
    }

    /**
     * @inheritdoc
     */
    public getResource(): TileworldResource {

        return this;
    }

    /**
     * @inheritdoc
     */
    public async process(data: T): Promise<T> {

        // get the loader via manual injection because of circular dependency problem it
        // can not be injected automaticly
        const loader = Injector.getInstance().instantiateClass(ResourceLoader);

        // get tmx data
        const tmx = data.getData();

        // load all tilesets from this world
        const tilesets = !Array.isArray(tmx.map.tileset) ? [tmx.map.tileset] : tmx.map.tileset;

        // declare load path
        const baseUrl = data.getRequestUrl().replace(/\/([\w]+\.tmx)$/, "");
        this.tilesets = await Promise.all(tilesets.map(
            async tileset => {
                return {
                    tileset: await loader.loadTileset(`${baseUrl}/${tileset.__source}`),
                    firstgid: tileset.__firstgid
                };
            }
        ));

        // extract layer data
        if (!Array.isArray(tmx.map.layer)) {
            tmx.map.layer = [tmx.map.layer];
        }
        tmx.map.layer.forEach((layer, layerNumber) => {

            // build x and y coordinate for this tile
            let currentX = 0;
            let currentY = 0;

            if (!Array.isArray(layer.data.tile)) {
                layer.data.tile = [layer.data.tile];
            }
            layer.data.tile.forEach((tile, i) => {

                // check y adjust
                if (i % tmx.map.__width === 0 && i > 0) {

                    // adjust y
                    currentY += 1;

                    // reset x
                    currentX = 0;
                }

                // save this position
                this.addWorldCoordinate(layerNumber, currentX, currentY, tile.__gid || -1);

                // increase x
                currentX += 1;

            });
        });

        // no data tweak
        return data;
    }

    /**
     * get the corresponding tileset by tile gid
     * @param tile the tile gid
     */
    public getTilesetByTileGid(tile: number): TilesetResource | null {

        let tileset: TilesetResource;
        this.tilesets.some((set, index) => {

            // first guid must validated
            if (set.firstgid <= tile && ((this.tilesets[index + 1] && this.tilesets[index + 1].firstgid > tile) || !this.tilesets[index + 1])) {

                tileset = set.tileset;
                return true;
            }
            return false;
        });

        return tileset!;
    }

    /**
     * adds the given position to the world map
     * @param layer the layer
     * @param x the x coordinate
     * @param y the y coordinate
     * @param tile the tile gid number
     */
    private addWorldCoordinate(layer: number, x: number, y: number, tile: number): void {

        // initialize layer
        this.world[layer] = this.world[layer] || [];
        this.world[layer].xy = this.world[layer].xy || [];
        this.world[layer].yx = this.world[layer].yx || [];

        // set xy first
        this.world[layer].xy[x] = this.world[layer].xy[x] || [];
        this.world[layer].xy[x][y] = tile;

        // now yx
        this.world[layer].yx[y] = this.world[layer].yx[y] || [];
        this.world[layer].yx[y][x] = tile;

        // search for the given tile in the tileset to get the correct picture
        const tileset = this.getTilesetByTileGid(tile);

        // prepare generated world
        this.generatedWorld[layer] = this.generatedWorld[layer] || [];
        this.generatedWorld[layer].xy = this.generatedWorld[layer].xy || [];
        this.generatedWorld[layer].yx = this.generatedWorld[layer].yx || [];

        // set xy first
        this.generatedWorld[layer].xy[x] = this.generatedWorld[layer].xy[x] || [];

        // now yx
        this.generatedWorld[layer].yx[y] = this.generatedWorld[layer].yx[y] || [];

        // set the tile image
        if (tileset) {

            // get the gid offset for this tileset
            const tilesetData = this.tilesets.find(set => set.tileset === tileset);
            if (tilesetData) {

                // get the image of the tile number including offset
                const tileImage = tileset.getTileImageByGid(tile + (tilesetData.firstgid - 1));
                if (tileImage) {
                    this.generatedWorld[layer].xy[x][y] = tileImage;
                    this.generatedWorld[layer].yx[y][x] = tileImage;
                }
            }
        }
    }
}
