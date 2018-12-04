import { InternalMessage } from "../InternalMessage";
import { Engine } from "../../../Engine";

/**
 * indicates that the engine bootstrap has been finished
 */
export class EngineBootstrapFinishedMessage extends InternalMessage<Engine> {

    constructor(engine: Engine) {
        super(engine);
    }
}
