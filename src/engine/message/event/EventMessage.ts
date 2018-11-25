import { MessageType } from "../MessageType";
import { BaseMessage } from "../BaseMessage";

/**
 * base class for all event messages
 */
export abstract class EventMessage<Payload = void> extends BaseMessage<Payload> {

    /**
     * @param payload the payload
     */
    constructor(
        payload: Payload
    ) {
        super(MessageType.EVENT, payload);
    }
}
