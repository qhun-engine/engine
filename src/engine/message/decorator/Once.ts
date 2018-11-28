import { Message } from "../Message";
import { ClassConstructor } from "../../constraint/ClassConstructor";
import { On } from "./On";

/**
 * Tell the engine that the decorated method should be executed when the given `Message`
 * class is processed via the `MessageBus`. The `Message` test will utilize instanceof to check
 * for the correct messages, so children of a certain parent class will also pass! This method is only called
 * once - when a capable message type passes
 * @param messageClass the message class to expect
 * @param predicate an aditional filter function that is passed into the event stream
 */
export function Once<M extends Message>(messageClass: ClassConstructor<M>, predicate: (message: M) => boolean = () => true): MethodDecorator {

    // utilize the on decorator and pass the dont observe boolean
    return On(messageClass, false, predicate);
}
