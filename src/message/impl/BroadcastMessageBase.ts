import { MessageType } from "../MessageType";
import { MessageBase } from "./MessageBase";
import { BroadcastMessage } from "../BroadcastMessage";

export abstract class BroadcastMessageBase<D = any, T extends MessageType = MessageType> extends MessageBase<T, D> implements BroadcastMessage<T, D> { }
