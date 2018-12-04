import { MessageType } from "../MessageType";
import { BaseMessage } from "../BaseMessage";

/**
 * base class for all internal messages
 */
export abstract class InternalMessage<Payload = void> extends BaseMessage<Payload> {

    /**
     * @param payload the payload
     */
    constructor(
        payload: Payload
    ) {
        super(MessageType.INTERNAL, payload);
    }
}
