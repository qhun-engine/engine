import { Message } from "../Message";
import { ClassConstructor } from "../../constraint/ClassConstructor";
import { On } from "./On";

/**
 * Tell the engine that the decorated method should be executed when the given `Message`
 * class is processed via the `MessageBus`. The `Message` test will utilize instanceof to check
 * for the correct messages, so children of a certain parent class will also pass! This method is only called
 * once - when a capable message type passes
 * @param messageClass the message class to expect
 */
export function Once(messageClass: ClassConstructor<Message>): MethodDecorator {

    // utilize the on decorator and pass the dont observe boolean
    return On(messageClass, false);
}
