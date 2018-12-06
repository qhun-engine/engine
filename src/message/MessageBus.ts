import { Injectable, Observable } from "@qhun-engine/base";
import { Message } from "./Message";
import { MessageType } from "./MessageType";
import { InternalMessageBus } from "./InternalMessageBus";

/**
 * The message bus is responsable for taking messages and deliver them to the right target.
 * This class presents the public visible API for the message system.
 */
@Injectable()
export class MessageBus<T extends MessageType = MessageType> {

    constructor(
        private internalBus: InternalMessageBus<T>
    ) { }

    /**
     * send the given message using the message bus
     * @param message the message to send
     */
    public send(message: Message<T>): void {

        // redirect to internal bus
        return this.internalBus.send(message);
    }

    /**
     * observe the message queue and get all messages of the given type
     * @param type the message type to look for
     */
    public observe<K extends T>(type: K): Observable<Message<K>> {

        // redirect to internal bus
        return this.internalBus.observe(type);
    }

    /**
     * get the current queue size.
     * @param type when given, the size is returned for this type only
     */
    public getQueueSize(type?: T): number {

        // redirect to internal bus
        return this.internalBus.getQueueSize(type);
    }
}
