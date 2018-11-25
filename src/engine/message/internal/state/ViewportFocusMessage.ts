import { InternalMessage } from "../InternalMessage";

/**
 * indicates that game window is not focused any more
 */
export class ViewportFocusMessage extends InternalMessage<Event> {

    constructor(focusEvent: Event) {
        super(focusEvent);
    }
}
