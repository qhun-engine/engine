import { ClassConstructor } from "@qhun-engine/base";
import { Message } from "../Message";
import { On } from "./On";
import { MessageType } from "../MessageType";

/**
 * Tell the engine that the decorated method should be executed when the given `Message`
 * class is processed via the `MessageBus`. The `Message` test will utilize instanceof to check
 * for the correct messages, so children of a certain parent class will also pass! This method is only called
 * once - when a capable message type passes
 * @param type the global message type channel for the observable
 * @param messageClass the message class to expect
 * @param predicate an aditional filter function that is passed into the event stream
 */
export function Once<K extends MessageType, M extends Message>(
    type: K,
    messageClass: ClassConstructor<M>,
    predicate: (message: Message) => boolean = () => true
): MethodDecorator {

    // utilize the on decorator and pass the dont observe boolean
    return On(type, messageClass, true, predicate);
}
