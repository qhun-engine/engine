import { Message } from "../Message";
import { MessageType } from "../MessageType";

/**
 * the most basic message implementation
 */
export abstract class MessageBase<T extends MessageType = MessageType, D = any> implements Message<T, D> {

    /**
     * the type of this message
     */
    protected abstract type: T;

    /**
     * @param data the data or payload of this message
     */
    constructor(
        protected data: D
    ) { }

    /**
     * @inheritdoc
     */
    public getType(): T {

        return this.type;
    }

    /**
     * @inheritdoc
     */
    public getData(): D {

        return this.data;
    }
}
