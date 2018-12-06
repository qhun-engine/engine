import { TargetedMessage } from "../TargetedMessage";
import { CanHandleMessages } from "../../constraint/CanHandleMessages";
import { MessageType } from "../MessageType";
import { MessageBase } from "./MessageBase";

export abstract class TargetedMessageBase<D = any, T extends CanHandleMessages = CanHandleMessages, K extends MessageType = MessageType>
    extends MessageBase<K, D> implements TargetedMessage<T, K, D> {

    /**
     * @param target the target of this message
     */
    constructor(
        protected target: T,
        data: D
    ) {

        super(data);
    }

    /**
     * @inheritdoc
     */
    public getTarget(): T {

        return this.target;
    }
}
