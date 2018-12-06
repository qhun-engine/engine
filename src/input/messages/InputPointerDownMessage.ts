import { BroadcastMessageBase } from "../../message/impl/BroadcastMessageBase";
import { PointerDown } from "../impl/PointerDown";
import { MessageType } from "../../message/MessageType";

export class InputPointerDownMessage extends BroadcastMessageBase<PointerDown> {

    protected type = MessageType.Input;
}
