import { MessageType } from "./MessageType";
import { Serializable } from "../constraint/Serializable";

/**
 * a message that can be send using the `MessageBus`
 */
export interface Message<Payload = any> extends Serializable {

    /**
     * get the payload attached to this message
     */
    getPayload(): Payload;

    /**
     * set the new payload for this message
     * @param data the new payload for the message
     */
    setPayload(data: Payload): ThisType<Payload>;

    /**
     * get the message type of this message
     */
    getType(): MessageType;

    /**
     * set the new type for this message
     * @param type the new type of the message
     */
    setType(type: MessageType): ThisType<Payload>;
}
