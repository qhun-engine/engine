import { Vector } from "../math/Vector";
import { BaseCamera } from "./BaseCamera";
import { Transition } from "../animation/transition/Transition";
import { RenderContext } from "../render/RenderContext";
import { TransitionContainer } from "../animation/transition/TransitionContainer";
import { Inject } from "../di/Inject";
import { IsometricTileRendering } from "../render/util/IsometricTileRendering";
import { InputPoint } from "../input/generic/InputPoint";
import { Ray } from "../math/Ray";

/**
 * A 2.5d based camera for projecting isomatric (3d) objects onto a 2d viewport
 */
export class IsometricCamera extends BaseCamera {

    @Inject()
    protected transitions!: TransitionContainer;

    /**
     * @inheritdoc
     */
    public shake(intensity: Vector, duration: number, transition: Transition = this.transitions.getEaseInOut()): void {
        /** noop */
    }

    /**
     * @inheritdoc
     */
    public zoom(scale: number, duration: number, transition: Transition = this.transitions.getEaseInOut()): void {
        /** noop */
    }

    /**
     * @inheritdoc
     */
    public draw(context: RenderContext): void {
        /** noop */
    }

    /**
     * @inheritdoc
     */
    public screenToRay(point: InputPoint): Ray {

        // use a tile rendering helper class to transform coordinates
        const tileRendering = new IsometricTileRendering();

        // use the current viewport of the camera and add the coordinates of the input
        // to get the cartesian coordinate
        const tempPosition = this.viewport
            // get viewport width/height as vector
            .toVector("wh")
            // add the input point to it
            .add(point);

        // get world info and build a vector to reduce the current tempPoint to the origin cartesian tile base number
        const tileDim = this.world.getRenderableWorld().getTileDimension();
        const worldDim = this.world.getRenderableWorld().getWorldSize();
        let cartTileNumVector = tempPosition.divide(Vector.from(tileDim.w, tileDim.h));

        // using the offset of isometric world to adjust the cart tile num vector
        cartTileNumVector = cartTileNumVector.substract(tileRendering.getOffset(worldDim.w, worldDim.h, tileDim.w, tileDim.h));

        // transform the position to isometric coordinate system
        const mapPosition = tileRendering.getDrawingCoordinate(cartTileNumVector.x, cartTileNumVector.y, tileDim.w, tileDim.h);

        // build the ray
        return new Ray(point, tempPosition, mapPosition, this.world);
    }

}
