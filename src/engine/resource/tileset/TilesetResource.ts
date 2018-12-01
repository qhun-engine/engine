import { BaseResource } from "../BaseResource";
import { TSXTileset } from "./tiled/TSXTileset";
import { XmlTextResource } from "../text/XmlTextResource";
import { Inject } from "../../di/Inject";
import { ResourceLoader } from "../ResourceLoader";
import { ImageResource } from "../sprite/ImageResource";
import { DimensionPosition, DimensionSize } from "../../constraint/Dimension";
import { ImageCropService } from "../util/ImageCropService";
import { Injector } from "../../di/Injector";

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
        [gid: number]: {

            /**
             * name of the property
             */
            name: string,

            /**
             * value of the property
             */
            value: any
        }[]
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
     * @inheritdoc
     */
    @Inject(ImageCropService)
    public async process(data: T, imageCropService?: ImageCropService): Promise<T> {

        // get the loader via manual injection because of circular dependency problem it
        // can not be injected automaticly
        const loader = Injector.getInstance().instantiateClass(ResourceLoader);

        // get tsx data
        const tsx = data.getData();

        // first load the tileset image
        const url = data.getRequestUrl().replace(`${tsx.tileset.__name}.tsx`, tsx.tileset.image.__source);
        this.tilesetImage = await loader!.loadImage(url);

        // build the rectangles for the extraction process
        const rectangleStack: (DimensionPosition & DimensionSize)[] = [];
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
            rectangleStack.push({
                x: currentX, y: currentY, w: tsx.tileset.__tilewidth, h: tsx.tileset.__tileheight
            });

            // increase the currentX with the next spacing
            currentX += tsx.tileset.__tilewidth + (tsx.tileset.__spacing || 0);
        }

        // await image processing
        this.tiles = await imageCropService!.extractMultipleFromImage(this.tilesetImage.getData(), rectangleStack);

        // extract properties from the tileset
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

        // return the data without any changes
        return data;
    }
}
