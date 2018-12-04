import { InternalMessage } from "../InternalMessage";

/**
 * indicates that the connection to the server has been lost
 */
export class ConnectionToServerLostMessage extends InternalMessage<Error> {

    constructor(reason: Error) {
        super(reason);
    }
}
