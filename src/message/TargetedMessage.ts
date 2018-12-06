import { CanHandleMessages } from "../constraint/CanHandleMessages";
import { Message } from "./Message";
import { MessageType } from "./MessageType";

export interface TargetedMessage<T extends CanHandleMessages = CanHandleMessages, K extends MessageType = MessageType, D = any> extends Message<K, D> {

    /**
     * get the target of this message
     */
    getTarget(): T;
}

/**
 * type guard function for targeted messages
 * @param message the message to test
 */
export function messageIsTargetedMessage(message: Message): message is TargetedMessage {

    return typeof (message as TargetedMessage).getTarget === "function";
}
