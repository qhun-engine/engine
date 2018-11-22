import { MessageType } from "../../MessageType";
import { InternalMessage } from "../InternalMessage";

/**
 * the game stop message indicates that the now **stops** processes inputs, updates and draw frames
 */
export class GameStopMessage extends InternalMessage<void> {

    constructor() {
        super(MessageType.INTERNAL, undefined);
    }
}
