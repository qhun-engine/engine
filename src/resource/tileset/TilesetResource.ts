import { Injector } from "@qhun-engine/base";
import { BaseResource } from "../BaseResource";
import { TSXTileset, TSXTile } from "./tiled/TSXTileset";
import { XmlTextResource } from "../text/XmlTextResource";
import { ResourceLoader } from "../ResourceLoader";
import { ImageResource } from "../sprite/ImageResource";
import { ImageCropService } from "../util/ImageCropService";
import { ResourceError } from "../../exception/ResourceError";
import { AsyncDataService } from "../../util/AsyncDataService";
import { Rectangle } from "../../math/Rectangle";

declare type TileProperty = {

    /**
     * name of the property
     */
    name: string,

    /**
     * value of the property
     */
    value: any
};

declare type TileAnimation = {

    /**
     * the tile number
     */
    tileGid: number,

    /**
     * the frame duration in ms
     */
    duration: number
};

/**
 * a tile set wraped by a resource context
 */
export class TilesetResource<T extends XmlTextResource<TSXTileset> = XmlTextResource<TSXTileset>> extends BaseResource<T> {

    /**
     * contains all tiles by its gid
     */
    protected tiles: { [gid: number]: HTMLImageElement } = {};

    /**
     * contains properties of tiles by its gid
     */
    protected tileProperties: {
        [gid: number]: TileProperty[]
    } = {};

    /**
     * contains animated tiles of this tileset
     */
    protected tileAnimations: {
        [gid: number]: TileAnimation[]
    } = {};

    /**
     * the tileset image base
     */
    protected tilesetImage!: ImageResource;

    /**
     * get the tile image by number
     * @param gid the gid number of the tile
     */
    public getTileImageByGid(gid: number): HTMLImageElement | null {

        return this.tiles[gid - 1];
    }

    /**
     * get properties by tile number
     * @param gid the tile number
     */
    public getTilePropertiesByGid(gid: number): TileProperty[] {

        return this.tileProperties[gid - 1] || [];
    }

    /**
     * get animations of this tile
     * @param gid the tile number
     */
    public getTileAnimationByGid(gid: number): TileAnimation[] {

        return this.tileAnimations[gid - 1] || [];
    }

    /**
     * @inheritdoc
     */
    public async process(data: T): Promise<T> {

        // get tsx data
        const tsx = data.getData();

        // cast tile array info
        if (tsx.tileset.tile && !Array.isArray(tsx.tileset.tile)) {
            tsx.tileset.tile = [tsx.tileset.tile || []];
        }

        // test if the tileset contains one sprite sheet or multiple tile images
        if (tsx.tileset.image) {

            // one sprite sheet image, extract all tile images
            await this.processTilesetImagesFromSpriteSheet(data);
        } else if (tsx.tileset.tile && tsx.tileset.tile[0].image) {

            // get every tile image from its origin
            await this.processTilesetImagesFromMultipleOrigins(data);
        } else {

            throw new ResourceError(`This tileset resource does not contain any information about tile images!`);
        }

        // iterate over all tile informations
        tsx.tileset.tile!.filter(tile => !!tile).forEach(tile => {

            // get properties
            if (tile.properties && tile.properties.property) {

                // initialize if empty
                this.tileProperties[tile.__id] = this.tileProperties[tile.__id] || [];

                const properties = Array.isArray(tile.properties.property) ? tile.properties.property : [tile.properties.property];

                // add these properties
                this.tileProperties[tile.__id].push(...properties.map(prop => {

                    // cast to internal property
                    return {
                        name: prop.__name,
                        value: prop.__value
                    } as TileProperty;
                }));
            }

            // get animations
            if (tile.animation && tile.animation.frame) {

                // initialize if empty
                this.tileAnimations[tile.__id] = this.tileAnimations[tile.__id] || [];

                // iterate over all frames
                this.tileAnimations[tile.__id].push(...tile.animation.frame.map(frame => {

                    return {
                        tileGid: frame.__tileid,
                        duration: frame.__duration
                    } as TileAnimation;
                }));
            }

        });

        // return the data without any changes
        return data;
    }

    /**
     * extracts the images from one large sprite sheet file
     * @param data the processed data
     */
    private async processTilesetImagesFromSpriteSheet(data: T): Promise<void> {

        // get the loader via manual injection because of circular dependency problem it
        // can not be injected automaticly
        const injector = Injector.getInstance();
        const loader = injector.instantiateClass(ResourceLoader);
        const imageCropService = injector.instantiateClass(ImageCropService);

        // get tsx data
        const tsx = data.getData();

        // first load the tileset image
        const url = data.getRequestUrl().replace(`${tsx.tileset.__name}.tsx`, tsx.tileset.image!.__source);
        this.tilesetImage = await loader!.loadImage(url);

        // build the rectangles for the extraction process
        const rectangleStack: Rectangle[] = [];
        let currentX = tsx.tileset.__margin || 0;
        let currentY = tsx.tileset.__margin || 0;
        for (let gid = 0; gid < tsx.tileset.__tilecount; gid++) {

            // check y adjust
            if (gid % tsx.tileset.__columns === 0 && gid > 0) {

                // adjust y
                currentY += tsx.tileset.__tileheight + (tsx.tileset.__spacing || 0);

                // reset x
                currentX = tsx.tileset.__margin || 0;
            }

            // store this position
            rectangleStack.push(new Rectangle(
                currentX, currentY, tsx.tileset.__tilewidth, tsx.tileset.__tileheight
            ));

            // increase the currentX with the next spacing
            currentX += tsx.tileset.__tilewidth + (tsx.tileset.__spacing || 0);
        }

        // await image processing
        this.tiles = await imageCropService!.extractMultipleFromImage(this.tilesetImage.getData(), rectangleStack);
    }

    /**
     * get every single tile image from its origin and save it to the class context
     * @param data the processed data
     */
    private async processTilesetImagesFromMultipleOrigins(data: T): Promise<void> {

        // get di services
        const injector = Injector.getInstance();
        const asyncData = injector.instantiateClass(AsyncDataService);
        const loader = injector.instantiateClass(ResourceLoader);

        // get tsx data
        const tsx = data.getData();

        // iterate over the tiles and get its origin
        this.tiles = await asyncData.asyncMap((tsx.tileset.tile as TSXTile[]), async tile => {

            // does this tile have an image?
            if (tile.image) {

                // get url of the image
                const url = data.getRequestUrl().replace(`${tsx.tileset.__name}.tsx`, tile.image.__source);
                return loader.loadImage(url).then(image => image.getData());
            } else {

                // no image available but the tile id is nessesary, use an empty image
                return new Image();
            }

        });
    }
}
