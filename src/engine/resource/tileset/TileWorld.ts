import { RenderableTileWorld } from "./RenderableTileWorld";

export interface Tileworld {

    /**
     * get the renderable tileworld for this instance
     */
    getRenderableWorld(): RenderableTileWorld;
}
