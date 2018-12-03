import { BaseResource } from "../BaseResource";
import { TSXTileset } from "./tiled/TSXTileset";
import { XmlTextResource } from "../text/XmlTextResource";
import { Inject } from "../../di/Inject";
import { ResourceLoader } from "../ResourceLoader";
import { ImageResource } from "../sprite/ImageResource";
import { DimensionPosition, DimensionSize } from "../../constraint/Dimension";
import { ImageCropService } from "../util/ImageCropService";
import { Injector } from "../../di/Injector";
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

        return this.tileProperties[gid] || [];
    }

    /**
     * @inheritdoc
     */
    public async process(data: T): Promise<T> {

        // get tsx data
        const tsx = data.getData();

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

        // extract properties from the tileset if available
        if (tsx.tileset.tile && tsx.tileset.tile[0].properties && tsx.tileset.tile[0].properties.property) {

            // iterate over all properties
            tsx.tileset.tile.forEach(propertiesWrapper => {

                // initialize if empty
                this.tileProperties[propertiesWrapper.__id] = this.tileProperties[propertiesWrapper.__id] || [];

                // set every property as array
                let propData = propertiesWrapper.properties.property;
                if (!Array.isArray(propData)) {
                    propData = [propData];
                }

                // add these properties
                this.tileProperties[propertiesWrapper.__id].push(...propData.map(prop => {

                    // cast to internal property
                    return {
                        name: prop.__name,
                        value: prop.__value
                    };
                }));
            });
        }

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
        this.tiles = await asyncData.asyncMap(tsx.tileset.tile!, async tile => {

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
