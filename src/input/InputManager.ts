import { Injectable } from "@qhun-engine/base";
import { MessageBus } from "../message/MessageBus";
import { InputPointerDownMessage } from "./messages/InputPointerDownMessage";
import { PointerDown } from "./impl/PointerDown";
import { InputPointerUpMessage } from "./messages/InputPointerUpMessage";
import { PointerUp } from "./impl/PointerUp";
import { InputPointerMoveMessage } from "./messages/InputPointerMoveMessage";
import { PointerMove } from "./impl/PointerMove";

@Injectable()
export class InputManager {

    constructor(
        private messageBus: MessageBus
    ) { }

    /**
     * setup all nessesary input events
     */
    public setupInput(): void {

        window.addEventListener("pointerdown", this.handlePointerDown.bind(this));
        window.addEventListener("pointerup", this.handlePointerUp.bind(this));
        window.addEventListener("pointermove", this.handlePointerMove.bind(this));

        // ignore contextmenu event
        window.addEventListener("contextmenu", event => event.preventDefault(), false);
    }

    /**
     * handles pointer down events
     * @param event the original pointer event
     */
    private handlePointerDown(event: PointerEvent): void {

        event.stopPropagation();
        event.stopImmediatePropagation();

        this.messageBus.send(new InputPointerDownMessage(
            PointerDown.fromPointerEvent(PointerDown, event)
        ));
    }

    /**
     * handles pointer up events
     * @param event the original pointer event
     */
    private handlePointerUp(event: PointerEvent): void {

        this.messageBus.send(new InputPointerUpMessage(
            PointerUp.fromPointerEvent(PointerUp, event)
        ));
    }

    /**
     * handles pointer move events
     * @param event the original pointer event
     */
    private handlePointerMove(event: PointerEvent): void {

        this.messageBus.send(new InputPointerMoveMessage(
            PointerMove.fromPointerEvent(PointerMove, event)
        ));
    }
}
