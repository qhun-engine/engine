import { InternalMessage } from "../InternalMessage";
import { MessageType } from "../../MessageType";

/**
 * indicates that the connection to the server has been lost
 */
export class ConnectionToServerLostMessage extends InternalMessage<Error> {

    constructor(reason: Error) {
        super(MessageType.INTERNAL, reason);
    }
}
