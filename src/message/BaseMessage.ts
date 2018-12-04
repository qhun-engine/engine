import { MessageType } from "./MessageType";
import { Message } from "./Message";

/**
 * base class for all internal messages
 */
export abstract class BaseMessage<Payload = void> implements Message<Payload> {

    /**
     * @param payload the payload
     */
    constructor(
        protected type: MessageType,
        protected payload: Payload
    ) { }

    public getPayload(): Payload {
        return this.payload;
    }

    public setPayload(data: Payload): this {
        this.payload = data;
        return this;
    }

    public getType(): MessageType {
        return this.type;
    }

    public setType(type: MessageType): this {
        this.type = type;
        return this;
    }

    public serialize(): string {
        return JSON.stringify(this);
    }
}
