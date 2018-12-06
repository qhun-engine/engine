import { TargetedMessage } from "../message/TargetedMessage";

export interface CanHandleMessages {

    /**
     * handles the given message
     * @param message the message the should be handles
     */
    handleMessage(message: TargetedMessage<any>): void;
}
