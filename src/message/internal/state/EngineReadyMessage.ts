import { InternalMessage } from "../InternalMessage";

/**
 * indicates that the engine is ready to process data
 */
export class EngineReadyMessage extends InternalMessage<void> {

    constructor() {
        super(undefined);
    }
}
