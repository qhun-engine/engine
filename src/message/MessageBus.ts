import { Observer, Observable, Subscription, Injectable } from "@qhun-engine/base";

import { Message } from "./Message";

/**
 * the message bus is responsable for taking messages and deliver them to the right target
 */
@Injectable()
export class MessageBus {

    /**
     * all messages that are currently queued
     */
    private queue: Message[] = [];

    /**
     * the message observable
     */
    private messageObservers: Observer<Message>[] = [];

    /**
     * send a message
     * @param message the message to send
     */
    public send(message: Message): void {

        // append this message to the queue
        this.queue.push(message);
    }

    /**
     * send a message directly into the message bus (high priority)
     * @param message the message to send
     */
    public sendImmediately(message: Message): void {

        // dispatch this message immediatly
        this.dispatchMessages([message]);
    }

    /**
     * dispatches all messages that are on the queue
     * @return the number of dispatched messages
     */
    public dispatch(): number {

        // get queue size
        const size = this.getQueueSize();

        // use the queue to dispatch this messages
        this.dispatchMessages(this.queue);

        // empty the queue
        this.queue = [];

        return size;
    }

    /**
     * get the current size of the queue
     */
    public getQueueSize(): number {

        return this.queue.length;
    }

    /**
     * observe the message bus for new messages
     */
    public observe(): Observable<Message> {

        return new Observable<Message>(observer => {
            this.messageObservers.push(observer);
            return new Subscription(() => {

                // remove observer from the stack
                this.messageObservers = this.messageObservers.splice(this.messageObservers.indexOf(observer), 1);
            });
        });
    }

    /**
     * send all given messages
     * @param messages all messages that need to be send
     */
    private dispatchMessages(messages: Message[]): void {

        // check if there are subscribers
        if (this.messageObservers.length === 0) { return; }

        // iterate over all messages
        messages.forEach(message =>

            // get all subscriptions and call the data event
            this.messageObservers.forEach(o => o.next(message))
        );
    }
}
