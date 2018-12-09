import { BroadcastMessageBase } from "../../message/impl/BroadcastMessageBase";
import { MessageType } from "../../message/MessageType";
import { Engine } from "../../Engine";

export class EngineReadyMessage extends BroadcastMessageBase<Engine> {

    protected type = MessageType.Engine;
}
