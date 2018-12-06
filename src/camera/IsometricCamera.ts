import { Inject } from "@qhun-engine/base";

import { Vector } from "../math/Vector";
import { BaseCamera } from "./BaseCamera";
import { Transition } from "../animation/transition/Transition";
import { RenderContext } from "../render/RenderContext";
import { TransitionContainer } from "../animation/transition/TransitionContainer";
import { IsometricTileRendering } from "../render/util/IsometricTileRendering";
import { Ray } from "../math/Ray";
import { Pointer } from "../input/Pointer";

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
    public screenToRay(point: Pointer): Ray {

        // use a tile rendering helper class to transform coordinates
        const tileRendering = new IsometricTileRendering();

        // use the current viewport of the camera and add the coordinates of the input
        // to get the cartesian coordinate
        const tempPosition = this.viewport
            // get viewport width/height as vector
            .toVector("wh")
            // add the input point to it
            .add(point.getPosition());

        // get world info and build a vector to reduce the current tempPoint to the origin cartesian tile base number
        const tileSize = this.world.getTileSize();
        const worldSize = this.world.getTileNumbers();
        let cartTileNumVector = tempPosition.divide(tileSize);

        // using the offset of isometric world to adjust the cart tile num vector
        cartTileNumVector = cartTileNumVector.substract(tileRendering.getOffset(worldSize.x, worldSize.x, tileSize.x, tileSize.y));

        // transform the position to isometric coordinate system
        const mapPosition = tileRendering.getDrawingCoordinate(cartTileNumVector.x, cartTileNumVector.y, tileSize.x, tileSize.y);

        // build the ray
        return new Ray(point.getPosition(), tempPosition, mapPosition, this.world);
    }

}
