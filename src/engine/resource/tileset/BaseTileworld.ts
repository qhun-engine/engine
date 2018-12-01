import { TileworldResource } from "./TileworldResource";
import { Tileworld } from "./Tileworld";
import { RenderableTileWorld } from "./RenderableTileWorld";

/**
 * a base class for tileworlds
 */
export abstract class BaseTileworld implements Tileworld {

    /**
     * the renderable resource of this world
     */
    protected worldResource!: TileworldResource;

    /**
     * set the tileworld resource
     * @param resource the resource to set
     */
    public setTileworldResource(resource: TileworldResource): this {

        this.worldResource = resource;
        return this;
    }

    /**
     * @inheritdoc
     */
    public getRenderableWorld(): RenderableTileWorld {

        return this.worldResource;
    }
}
