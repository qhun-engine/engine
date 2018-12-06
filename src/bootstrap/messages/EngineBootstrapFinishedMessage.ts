import { BroadcastMessageBase } from "../../message/impl/BroadcastMessageBase";
import { Engine } from "../../Engine";
import { MessageType } from "../../message/MessageType";

export class EngineBootstrapFinishedMessage extends BroadcastMessageBase<Engine> {

    protected type = MessageType.Engine;
}
