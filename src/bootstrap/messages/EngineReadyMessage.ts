import { BroadcastMessageBase } from "../../message/impl/BroadcastMessageBase";
import { MessageType } from "../../message/MessageType";

export class EngineReadyMessage extends BroadcastMessageBase<void> {

    protected type = MessageType.Engine;
}
