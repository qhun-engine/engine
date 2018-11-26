import { ImageResource } from "../sprite/ImageResource";
import { TileMapMetadata } from "./TileMapMetadata";
import { Inject } from "../../di/Inject";
import { SpriteImageExtractor } from "../sprite/SpriteImageExtractor";

/**
 * a tilemap resource that wraps the whole tilemap
 */
export class TileMapResource extends ImageResource {

    @Inject()
    protected spriteImageExtractor!: SpriteImageExtractor;

    /**
     * the metadata of this tilemap
     */
    protected tileMapMetadata!: TileMapMetadata;

    /**
     * contains all tile images by number
     */
    protected tileImages: ImageResource[] = [];

    /**
     * get the metadata from this tile sheet
     */
    public getTileMapMetadata(): TileMapMetadata {

        return this.tileMapMetadata;
    }

    /**
     * set the new metadata for this filemap
     * @param metadata the new metadata
     */
    public setTileMapMetadata(metadata: TileMapMetadata): this {

        this.tileMapMetadata = metadata;
        return this;
    }

    /**
     * get all tile images of the resource
     */
    public getTileImages(): ImageResource[] {

        return this.tileImages;
    }

    /**
     * prepare all tiles in this tilemap
     */
    public async prepareTiles(): Promise<void> {

        // extract every tile from the tilemap
        this.spriteImageExtractor.extractImagesFromTileSheet(this).then(images => {

            // we only want the image
            this.tileImages = images.map(image => image.image);
        });
    }

}
