import { BroadcastMessageBase } from "../../message/impl/BroadcastMessageBase";
import { MessageType } from "../../message/MessageType";

export class ViewportResizeMessage extends BroadcastMessageBase<Event> {

    protected type = MessageType.Environment;
}
