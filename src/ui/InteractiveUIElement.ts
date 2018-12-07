import { UIElement } from "./UIElement";
import { Pointer } from "../input/Pointer";

export interface InteractiveUIElement extends UIElement {

    /**
     * an event handler for pointer enter event
     */
    onPointerEnter?(event: Pointer): void;

    /**
     * an event handler for pointer leave event
     */
    onPointerLeave?(event: Pointer): void;

    /**
     * an event handler for pointer click event
     */
    onPointerClick?(event: Pointer): void;

    /**
     * an event handler for pointer down event
     */
    onPointerDown?(event: Pointer): void;

    /**
     * an event handler for pointer down event
     */
    onPointerUp?(event: Pointer): void;
}
