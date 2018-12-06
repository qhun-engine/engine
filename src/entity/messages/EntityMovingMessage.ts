import { TargetedMessageBase } from "../../message/impl/TargetedMessageBase";
import { MessageType } from "../../message/MessageType";
import { Vector } from "../../math/Vector";

export class EntityMovingMessage extends TargetedMessageBase<Vector> {

    protected type = MessageType.Moving;
}
