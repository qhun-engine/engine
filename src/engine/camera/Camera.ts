import { Vector } from "../math/Vector";
import { Transition } from "../animation/transition/Transition";
import { RenderContext } from "../render/RenderContext";

/**
 * indicates that this class can be used to decide what is on the screen and what is not, that this
 * class can project the world to the player
 */
export interface Camera {

    /**
     * get the current position of the camera for both axis
     */
    getPosition(): Vector;

    /**
     * set the new camera position
     * @param position the new position to set
     */
    setPosition(position: Vector): ThisType<Camera>;

    /**
     * get the cameras moving velocity
     */
    getVelocity(): Vector;

    /**
     * set the new moving velocity of this camera
     * @param velocity the new velocity
     */
    setVelocity(velocity: Vector): ThisType<Camera>;

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
}
