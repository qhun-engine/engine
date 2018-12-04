import { InternalMessage } from "../InternalMessage";

/**
 * indicates that the connection to the server is not up and running
 */
export class ConnectionToServerEstablishedMessage extends InternalMessage {

    constructor() {
        super(undefined);
    }
}
