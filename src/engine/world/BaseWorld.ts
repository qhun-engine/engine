import { World } from "./World";
import { WorldPerspective } from "./WorldPerspective";
import { OrthographicCamera } from "../camera/OrthographicCamera";
import { IsometricCamera } from "../camera/IsometricCamera";
import { ResourceError } from "../exception/ResourceError";
import { Vector } from "../math/Vector";
import { Camera } from "../camera/Camera";
import { Injector } from "../di/Injector";
import { Environment } from "../environment/Environment";
import { Tile } from "./Tile";
import { TileworldResource } from "../resource/tileset/TileworldResource";
import { Loadable } from "../resource/Loadable";
import { RenderableWorld } from "./RenderableWorld";

/**
 * a base class for tileworlds
 */
export abstract class BaseWorld<T extends TileworldResource = TileworldResource> implements World<T> {

    /**
     * the current world resource
     */
    protected resource!: T;

    /**
     * the loadable type to load the resource
     */
    protected loadableResource!: Loadable<T>;

    /**
     * represent the current world state
     * multi dimensional array in the form:
     * - Tile[layer][yCoordinate][XCoordinate]
     */
    protected layout: Tile[][][] = [];

    /**
     * stores the current perspective of the world
     */
    protected perspective!: WorldPerspective;

    public getRenderableWorld(): RenderableWorld {
        return this.resource;
    }

    /**
     * @inheritdoc
     */
    public getLayout(layer: number): Tile[][] {

        // return y/x based tile array
        return this.layout[layer];
    }

    /**
     * @inheritdoc
     */
    public getLayerCount(): number {

        // return layer count from layout
        return this.layout.length;
    }

    /**
     * @inheritdoc
     */
    public getPerspective(): WorldPerspective {

        return this.perspective;
    }

    /**
     * @inheritdoc
     */
    public setResource(resource: Loadable<T>): void {

        this.loadableResource = resource;
    }

    /**
     * @inheritdoc
     */
    public async load(): Promise<void> {

        // load the resource first
        this.resource = await this.loadableResource();

        // get the perspective out of the loaded resource
        this.perspective = this.resource.getWorldPerspective();
    }

    /**
     * @inheritdoc
     */
    public isLoaded(): boolean {

        return !!this.resource;
    }

    /**
     * create a camera for this world
     * @param initialPosition the initial position of the camera
     * @param zoomScale the zoom scale of this camera
     */
    public createCamera(initialPosition: Vector = Vector.ZERO, zoomScale: number = 1): Camera {

        // check if the world has been loaded (at least the perspective has to be set)
        if (typeof this.perspective !== "string") {

            // throw an error
            throw new ResourceError(`No perspective is set on the world ${this.constructor.name}. Please load the world first or set the perspective.`);
        }

        // get environment to create the camera
        const env = Injector.getInstance().instantiateClass(Environment);

        // get map perspective
        const perspective = this.perspective;

        // build camera by perspective
        if (perspective === WorldPerspective.ORTHOGONAL) {
            return new OrthographicCamera(
                initialPosition,
                Vector.from(env.getViewportSize().w, env.getViewportSize().h),
                this,
                zoomScale
            );
        } else if (perspective === WorldPerspective.ISOMETRIC) {
            return new IsometricCamera(
                initialPosition,
                Vector.from(env.getViewportSize().w, env.getViewportSize().h),
                this,
                zoomScale
            );
        }

        throw new ResourceError(`This world can not create a camera for the ${perspective} perspective. No camera found!`);
    }

    /**
     * unloads the world and free resources
     */
    public destroy(): void {

        delete this.resource;
        delete this.layout;
        delete this.perspective;
        delete this.loadableResource;
    }
}
