import { Message } from "./Message";
import { Observer, Observable, Subscription } from "../async/rx";
import { Injectable } from "../di/Injectable";

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
    private messageObserver!: Observer<Message>;
    private messageObservable = new Observable<Message>(observer => {
        this.messageObserver = observer;
        return new Subscription();
    });

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

        return this.messageObservable;
    }

    /**
     * send all given messages
     * @param messages all messages that need to be send
     */
    private dispatchMessages(messages: Message[]): void {

        // check if there are subscribers
        if (!this.messageObserver) { return; }

        // iterate over all messages
        messages.forEach(message =>

            // get all subscriptions and call the data event
            this.messageObserver.next(message)
        );
    }
}
