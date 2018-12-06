import { Pointer } from "../Pointer";
import { PointerType } from "../PointerType";
import { Vector } from "../../math/Vector";
import { ClassConstructor } from "@qhun-engine/base";

export abstract class PointerBase implements Pointer {

    /**
     * @param type the type of the device
     * @param position the position on the screen
     * @param originalEvent the original dom event
     */
    constructor(
        protected type: PointerType,
        protected position: Vector,
        protected originalEvent: PointerEvent
    ) { }

    /**
     * creates a pointer from an original dom event
     */
    public static fromPointerEvent<T extends Pointer>(classConstructor: ClassConstructor<T>, event: PointerEvent): T {

        return new classConstructor(event.type, Vector.from(event.clientX, event.clientY), event);
    }

    /**
     * get the device type of the event
     */
    public getType(): PointerType {

        return this.type;
    }

    /**
     * get the position of the current event
     */
    public getPosition(): Vector {

        return this.position;
    }

    /**
     * get the original dom pointer event
     */
    public getOriginalEvent(): PointerEvent {

        return this.originalEvent;
    }
}
