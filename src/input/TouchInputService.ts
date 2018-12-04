import { Injectable } from "@qhun-engine/base";

import { InputService } from "./InputService";
import { MessageBus } from "../message/MessageBus";

/**
 * handles touch input
 */
@Injectable()
export class TouchInputService implements InputService {

    constructor(
        private messageBus: MessageBus
    ) { }

    /**
     * @inheritdoc
     */
    public startListening(): void {

        // noop
    }
}
