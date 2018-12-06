import { Serializable } from "@qhun-engine/base";
import { Message } from "./Message";
import { MessageType } from "./MessageType";

export interface NetworkMessage<T extends MessageType = MessageType, D = any> extends Message<T, D>, Serializable { }
