import { TileworldResource } from "./TileworldResource";
import { TMXTileworld } from "./tiled/TMXTileworld";
import { XmlTextResource } from "../text/XmlTextResource";
import { DimensionSize } from "../../constraint/Dimension";
import { Inject } from "../../di/Inject";
import { ImageChunkService } from "../util/ImageChunkService";
import { LayeredWorldProperties } from "./LayeredWorldProperties";

/**
 * a chunked tile world wraped by a resource context
 */
export class TileworldChunkedResource<T extends XmlTextResource<TMXTileworld> = XmlTextResource<TMXTileworld>> extends TileworldResource<T> {

    /**
     * the chunk size in tiles
     */
    protected chunkSize: number = 1;

    /**
     * the world in chunked format
     */
    protected chunkedWorld: LayeredWorldProperties<number[]> = [];

    /**
     * stores layered chunk images
     */
    protected generatedChunks: LayeredWorldProperties<HTMLImageElement> = [];

    /**
     * set the chunk size. only effective if called before process!
     * @param chunkSize the new chunk size
     * @internal
     */
    public setChunkSize(chunkSize: number): this {

        this.chunkSize = chunkSize;
        return this;
    }

    /**
     * @inheritdoc
     */
    public getWorldSize(): DimensionSize {

        // get the unchunked world size
        const unchunkedSize = super.getWorldSize();

        // divide it by the chunk size
        return {
            w: Math.ceil(unchunkedSize.w / this.chunkSize),
            h: Math.ceil(unchunkedSize.h / this.chunkSize)
        };
    }

    /**
     * @inheritdoc
     */
    public getTileDimension(): DimensionSize {

        return {
            w: this.data.getData().map.__tilewidth * this.chunkSize,
            h: this.data.getData().map.__tileheight * this.chunkSize
        };
    }

    /**
     * @inheritdoc
     */
    public getTileImageByCoordinate(layer: number, x: number, y: number): HTMLImageElement {

        // first get the tile number
        return this.generatedChunks[layer].xy[x][y];
    }

    /**
     * @inheritdoc
     */
    @Inject(ImageChunkService)
    public async process(data: T, chunkService?: ImageChunkService): Promise<T> {

        // await parent process
        this.setData(await super.process(data));

        // take all layers and chunk them
        this.world.forEach((layer, layerNumber) => {
            Object.keys(layer.yx).forEach(y => {
                const numY = parseInt(y);
                Object.keys(layer.yx[numY]).forEach(x => {
                    const numX = parseInt(x);

                    // get chunked xy coordinate
                    const chunkedX = Math.floor(numX / this.chunkSize);
                    const chunkedY = Math.floor(numY / this.chunkSize);

                    // add this tile
                    this.addChunkedWorldCoordinate(layerNumber, chunkedX, chunkedY, layer.xy[numX][numY]);
                });
            });
        });

        // now get all chunk images
        const chunkPromiseStack: Promise<void>[] = [];
        this.chunkedWorld.forEach((layer, layerNumber) => {
            Object.keys(layer.xy).forEach(x => {
                const numX = parseInt(x);
                Object.keys(layer.xy[numX]).forEach(y => {
                    const numY = parseInt(y);

                    // get all tile numbers for this chunk
                    const tileNumbers = layer.xy[numX][numY];

                    // add this tile
                    chunkPromiseStack.push(chunkService!.chunkImages(
                        tileNumbers.map(tileNumber => {

                            // get the tileset for this every tile number and get the correct image
                            if (tileNumber >= 0) {
                                return this.getTilesetByTileGid(tileNumber)!.getTileImageByGid(tileNumber)!;
                            } else {
                                // empty image
                                return new Image();
                            }
                        }),
                        this.chunkSize,
                        // tell the chunk service the concrete dimension of one tile because the image may be
                        // empty because of no available tile
                        { w: this.data.getData().map.__tilewidth, h: this.data.getData().map.__tileheight }
                    ).then(image => {

                        // add this image to the generated chunks
                        this.addChunkedWorldImage(layerNumber, numX, numY, image);
                    }));
                });
            });
        });

        // wait for chunking, return original data
        return Promise.all(chunkPromiseStack).then(() => data);
    }

    /**
     * adds the given position to the world map
     * @param layer the layer
     * @param x the chunked x coordinate
     * @param y the chunked y coordinate
     * @param tile the tile gid numbers
     */
    private addChunkedWorldCoordinate(layer: number, x: number, y: number, tile: number): void {

        // initialize layer
        this.chunkedWorld[layer] = this.chunkedWorld[layer] || {};
        this.chunkedWorld[layer].xy = this.chunkedWorld[layer].xy || {};
        this.chunkedWorld[layer].yx = this.chunkedWorld[layer].yx || {};

        // set xy first
        this.chunkedWorld[layer].xy[x] = this.chunkedWorld[layer].xy[x] || {};
        this.chunkedWorld[layer].xy[x][y] = this.chunkedWorld[layer].xy[x][y] || [];
        this.chunkedWorld[layer].xy[x][y].push(tile);

        // now yx
        this.chunkedWorld[layer].yx[y] = this.chunkedWorld[layer].yx[y] || {};
        this.chunkedWorld[layer].yx[y][x] = this.chunkedWorld[layer].yx[y][x] || [];
        this.chunkedWorld[layer].yx[y][x].push(tile);
    }

    /**
     * adds the given position to the world map
     * @param layer the layer
     * @param x the chunked x coordinate
     * @param y the chunked y coordinate
     * @param image the rendered image of the chunk
     */
    private addChunkedWorldImage(layer: number, x: number, y: number, image: HTMLImageElement): void {

        // initialize layer
        this.generatedChunks[layer] = this.generatedChunks[layer] || {};
        this.generatedChunks[layer].xy = this.generatedChunks[layer].xy || {};
        this.generatedChunks[layer].yx = this.generatedChunks[layer].yx || {};

        // set xy first
        this.generatedChunks[layer].xy[x] = this.generatedChunks[layer].xy[x] || {};
        this.generatedChunks[layer].xy[x][y] = image;

        // now yx
        this.generatedChunks[layer].yx[y] = this.generatedChunks[layer].yx[y] || {};
        this.generatedChunks[layer].yx[y][x] = image;
    }
}
