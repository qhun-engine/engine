import { TileworldResource } from "./TileworldResource";
import { Tileworld } from "./Tileworld";
import { RenderableTileWorld } from "./RenderableTileWorld";
import { TileworldPerspective } from "./TileworldPerspective";
import { OrthographicCamera } from "../../camera/OrthographicCamera";
import { IsometricCamera } from "../../camera/IsometricCamera";
import { ResourceError } from "../../exception/ResourceError";
import { Vector } from "../../math/Vector";
import { Camera } from "../../camera/Camera";
import { Injector } from "../../di/Injector";
import { Environment } from "../../environment/Environment";

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

    /**
     * create a camera for this world
     * @param initialPosition the initial position of the camera
     * @param zoomScale the zoom scale of this camera
     */
    public createCamera(initialPosition: Vector = Vector.ZERO, zoomScale: number = 1): Camera {

        // get environment to create the camera
        const env = Injector.getInstance().instantiateClass(Environment);

        // get map perspective
        const perspective = this.worldResource.getData().getData().map.__orientation;

        // get world dimension
        const worldDimension = Vector.from(
            this.worldResource.getTileDimension().w * this.worldResource.getWorldSize().w,
            this.worldResource.getTileDimension().h * this.worldResource.getWorldSize().h
        );

        // build camera by perspective
        if (perspective === TileworldPerspective.ORTHOGONAL) {
            return new OrthographicCamera(
                initialPosition,
                Vector.from(env.getViewportSize().w, env.getViewportSize().h),
                worldDimension,
                zoomScale
            );
        } else if (perspective === TileworldPerspective.ISOMETRIC) {
            return new IsometricCamera(
                initialPosition,
                Vector.from(env.getViewportSize().w, env.getViewportSize().h),
                worldDimension,
                zoomScale
            );
        }

        throw new ResourceError(`This world can not create a camera for the ${perspective} perspective. No camera found!`);
    }
}
