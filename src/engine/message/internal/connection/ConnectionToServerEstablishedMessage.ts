import { InternalMessage } from "../InternalMessage";
import { MessageType } from "../../MessageType";

/**
 * indicates that the connection to the server is not up and running
 */
export class ConnectionToServerEstablishedMessage extends InternalMessage {

    constructor() {
        super(MessageType.INTERNAL, undefined);
    }
}
