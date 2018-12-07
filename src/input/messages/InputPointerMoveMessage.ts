import { BroadcastMessageBase } from "../../message/impl/BroadcastMessageBase";
import { MessageType } from "../../message/MessageType";
import { PointerMove } from "../impl/PointerMove";

export class InputPointerMoveMessage extends BroadcastMessageBase<PointerMove> {

    protected type = MessageType.Input;
}
