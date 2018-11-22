import { MessageType } from "../../MessageType";
import { InternalMessage } from "../InternalMessage";

/**
 * the game start message indicates that the engine processes inputs, updates and draw frames
 */
export class GameStartMessage extends InternalMessage<void> {

    constructor() {
        super(MessageType.INTERNAL, undefined);
    }
}
