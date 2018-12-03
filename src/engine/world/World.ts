import { Vector } from "../math/Vector";
import { Camera } from "../camera/Camera";
import { Tile } from "./Tile";
import { TileworldResource } from "../resource/tileset/TileworldResource";
import { Destroyable } from "../constraint/Destroyable";
import { WorldPerspective } from "./WorldPerspective";
import { Loadable } from "../resource/Loadable";
import { RenderableWorld } from "./RenderableWorld";

export interface World<T extends TileworldResource = TileworldResource> extends Destroyable {

    /**
     * create a perspective camera for this world
     * @param initialPosition the initial position of the camera in the world
     * @param zoomScale the initial zoom scale of this camera
     */
    createCamera(initialPosition: Vector, zoomScale: number): Camera;

    getRenderableWorld(): RenderableWorld;

    /**
     * get the perspective of the world
     */
    getPerspective(): WorldPerspective;

    /**
     * get all available tiles for the given layer. first dimension is Y coordinate
     * and second dimension is the X coordinate
     */
    getLayout(layer: number): Tile[][];

    /**
     * get the amount of layers in this world
     */
    getLayerCount(): number;

    /**
     * set the resource that will be loaded when the world loads
     * @param resource the loadable world resource
     */
    setResource(resource: Loadable<T>): void;

    /**
     * loads the world and its dependencies
     */
    load(): Promise<void>;

    /**
     * check if the world is loaded
     */
    isLoaded(): boolean;
}
