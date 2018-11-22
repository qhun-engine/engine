import { MessageType } from "../../MessageType";
import { InternalMessage } from "../InternalMessage";

/**
 * indicates that game window is not focused any more
 */
export class ViewportBlurMessage extends InternalMessage<Event> {

    constructor(blurEvent: Event) {
        super(MessageType.INTERNAL, blurEvent);
    }
}
