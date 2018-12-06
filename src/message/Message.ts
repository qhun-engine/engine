import { MessageType } from "./MessageType";

export interface Message<T extends MessageType = MessageType, D = any> {

    /**
     * get the unterlaying message type of this message
     */
    getType(): T;

    /**
     * get the message payload or attached data
     */
    getData(): D;
}
