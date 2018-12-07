import { Injectable, Observable, Observer, Subscription } from "@qhun-engine/base";
import { Message } from "./Message";
import { MessageType } from "./MessageType";
import { messageIsTargetedMessage } from "./TargetedMessage";

@Injectable()
export class InternalMessageBus<T extends MessageType = MessageType> {

    /**
     * represents the internal message queue grouped by message type
     */
    private queue: {
        [K in T]: Message<K>[]
    } = {} as any;

    /**
     * represents a stack of observers for the given message type
     */
    private observers: {
        [K in T]: Observer<Message<K>>[]
    } = {} as any;

    /**
     * send the given message using the message bus
     * @param message the message to send
     */
    public send(message: Message<T>): void {

        // stack by message type
        const type = message.getType();
        this.queue[type] = this.queue[type] || [];

        // add to queue
        this.queue[type].push(message);
    }

    /**
     * get the current queue size.
     * @param type when given, the size is returned for this type only
     */
    public getQueueSize(type?: T): number {

        if (type) {
            return Array.isArray(this.queue[type]) ? this.queue[type].length : 0;
        }

        // sum up existing messages of all types
        return (Object.keys(this.queue) as T[])
            // get for every available type
            .map(messageType => this.queue[messageType].length)
            // reduce to sum up the lengths
            .reduce((accumulator, current) => accumulator + current);
    }

    /**
     * observe the message queue and get all messages of the given type
     * @param type the message type to look for
     */
    public observe<K extends T>(type: K): Observable<Message<K>> {

        // create a new observable and store the observer
        // by the given type
        return new Observable(observer => {

            // add the given observer
            this.observers[type] = this.observers[type] || [];
            this.observers[type].push(observer);

            // build a subscription that removes the internal
            // observer when unsubscribed
            return new Subscription(() => {

                // remove the observer by type
                this.observers[type].splice(this.observers[type].indexOf(observer), 1);
            });
        });
    }

    /**
     * dispatches all messages on the queue
     */
    public dispatch(type?: MessageType): void {

        // if a certain type is given, iterate over those messages only
        if (type) {

            // check if there are messages for this type
            if (!Array.isArray(this.queue[type]) || this.queue[type].length === 0) {
                return;
            }

            // dispatch those messages from this category
            this.dispatchMessages(this.queue[type]);

            // empty the queue for this type
            this.queue[type] = [];
        } else {

            // iterate over all message types
            (Object.keys(this.queue) as T[]).forEach(messageType => {

                // dispatch those messages from this category
                this.dispatchMessages(this.queue[messageType]);

                // empty the queue for this type
                this.queue[messageType] = [];
            });

        }
    }

    /**
     * dispatches all given messages
     * @param messages the messages to dispatch
     */
    private dispatchMessages(messages: Message[]): void {

        // inform all observers
        messages.forEach(message => {

            // get message type and check if this is a broadcast message or
            // a targeted message
            if (messageIsTargetedMessage(message)) {

                // handle the message via mediator pattern
                return message.getTarget().handleMessage(message);
            }

            // handle via observable pattern.
            // get observers for this type
            const observers: Observer<Message>[] = this.observers[message.getType()] || [];

            // message will be discarded if there are no observers
            if (observers.length === 0) { return; }

            // inform all observers that want info of this message type that
            // a broadcast message is available
            observers.forEach(o => o.next(message));
        });
    }
}
