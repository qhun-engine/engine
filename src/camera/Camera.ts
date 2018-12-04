import { Vector } from "../math/Vector";
import { Transition } from "../animation/transition/Transition";
import { RenderContext } from "../render/RenderContext";
import { Rectangle } from "../math/Rectangle";
import { CameraFollowStrategy } from "./follow/CameraFollowStrategy";
import { HasPosition } from "../constraint/HasPosition";
import { HasVelocity } from "../constraint/HasVelocity";
import { Followable } from "./follow/Followable";
import { InputPoint } from "../input/generic/InputPoint";
import { Ray } from "../math/Ray";

/**
 * indicates that this class can be used to decide what is on the screen and what is not, that this
 * class can project the world to the player
 */
export interface Camera extends HasPosition, HasVelocity {

    /**
     * get the visible part of the world
     */
    getViewport(): Rectangle;

    /**
     * shakes the camera using the given intensity over the given duration
     * @param intensity the intensity indicates how strong the camera should shake
     * @param duration the duration in milliseconds
     */
    shake(intensity: Vector, duration: number, transition: Transition): void;

    /**
     * zooms in our out over the given time using the given transition function
     * @param scale the new scale to zoom to (in or out)
     * @param duration the duration in milliseconds
     * @param transition the transition function
     */
    zoom(scale: number, duration: number, transition: Transition): void;

    /**
     * get the current zoom scale
     */
    getZoom(): number;

    /**
     * directly set the zoom to this camera without applying duration or transition
     * @param scale the new scale to zoom to (in or out)
     */
    setZoom(scale: number): ThisType<Camera>;

    /**
     * the main update function where camera calculation should take place
     * @param engine the engine instance
     * @param delta the delta in milliseconds since the last update call
     */
    update(delta: number): void;

    /**
     * the main draw function where camera effects such as transitions and zooming should take place
     * @param context the current rendering context
     */
    draw(context: RenderContext): void;

    /**
     * determines if the camera is currently moving
     */
    isMoving(): boolean;

    /**
     * determines if the camera is currently zooming in or out
     */
    isZooming(): boolean;

    /**
     * follows the given object
     * @param object the object to follow
     * @param strategy the following strategy
     */
    follow<T extends Followable>(object: T, strategy?: CameraFollowStrategy<T>): ThisType<Camera>;

    /**
     * cast the given input point on the viewport to a ray that will hit
     * the underlying world position keeping the perspective in mind
     * @param point the point to cast the ray with
     */
    screenToRay(point: InputPoint): Ray;
}
