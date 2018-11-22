import { MessageType } from "../MessageType";
import { Message } from "../Message";

/**
 * base class for all internal messages
 */
export abstract class InternalMessage<Payload = void> implements Message<Payload> {

    /**
     * @param type the message type
     * @param payload the payload
     */
    constructor(
        private type: MessageType,
        private payload: Payload
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
