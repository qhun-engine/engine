import { PointerType } from "./PointerType";
import { Vector } from "../math/Vector";

export interface Pointer {

    /**
     * get the device type of the event
     */
    getType(): PointerType;

    /**
     * get the position of the current event
     */
    getPosition(): Vector;

    /**
     * get the original dom pointer event
     */
    getOriginalEvent(): PointerEvent;
}
