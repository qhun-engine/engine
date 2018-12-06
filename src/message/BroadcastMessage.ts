import { Message } from "./Message";
import { MessageType } from "./MessageType";

export interface BroadcastMessage<T extends MessageType = MessageType, D = any> extends Message<T, D> {

}
