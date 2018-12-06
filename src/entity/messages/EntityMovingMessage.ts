import { TargetedMessageBase } from "../../message/impl/TargetedMessageBase";
import { MessageType } from "../../message/MessageType";

export class EntityMovingMessage extends TargetedMessageBase {

    protected type = MessageType.Moving;
}
