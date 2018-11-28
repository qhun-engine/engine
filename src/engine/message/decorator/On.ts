import { Message } from "../Message";
import { ClassConstructor } from "../../constraint/ClassConstructor";
import { Injector } from "../../di/Injector";
import { MessageBus } from "../MessageBus";
import { MetadataRegistryService } from "../../util/MetadataRegistryService";
import { ReflectionMetadata } from "../../constraint/ReflectionMetadata";
import { ConstraintError } from "../../exception/ConstraintError";

// declare the registry here for performance reasons
const metadataRegistry = MetadataRegistryService.getInstance();

/**
 * Tell the engine that the decorated method should be executed when the given `Message`
 * class is processed via the `MessageBus`. The `Message` test will utilize instanceof to check
 * for the correct messages, so children of a certain parent class will also pass!
 * @param messageClass the message class to expect
 * @param observe observes the `MessageBus` for this message type and dont stop after the first message
 * @param predicate an aditional filter function that is passed into the event stream
 */
export function On<M extends Message>(
    messageClass: ClassConstructor<M>,
    observe: boolean = true,
    predicate: (message: M) => boolean = () => true
): MethodDecorator {

    // tslint:disable-next-line ban-types
    return <MethodDecorator>(<T extends Function>(target: object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => {

        // get the message bus instance and observe it for this kind of message
        const subscription = Injector.getInstance()
            .instantiateClass(MessageBus)
            // observe the message bus
            .observe()
            // let only pass the correct kind of messages
            .filter(message => message instanceof messageClass && predicate(message as M))
            // tell me when one message is available
            .subscribe(message => {

                // check if the class is a singleton instance, if not, the metadata request would fail
                if (!metadataRegistry.exists(ReflectionMetadata.Singleton, target.constructor as ClassConstructor)) {

                    // no singleton class
                    let errorMessage: string = "You can not use @On, @Once on a class that is not a @Singleton class. ";
                    errorMessage += `Class was: ${target.constructor.name}, method was: ${propertyKey.toString()}.\n${(target as any)[propertyKey]}`;
                    throw new ConstraintError(errorMessage);
                }

                // since the method decorator does not contain a concrete instance
                // we need to get the singleton instance from the metadata registry
                const instance = metadataRegistry.get(ReflectionMetadata.SingletonInstance, target.constructor as ClassConstructor);

                // call the method on this instance to preserve the context
                instance[propertyKey](message);

                // test for unsubscribe
                if (!observe) { subscription.unsubscribe(); }
            });

    });
}
