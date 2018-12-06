import { Injectable } from "@qhun-engine/base";
import { MessageBus } from "../message/MessageBus";
import { InputPointerDownMessage } from "./messages/InputPointerDownMessage";
import { PointerDown } from "./impl/PointerDown";
import { InputPointerUpMessage } from "./messages/InputPointerUpMessage";
import { PointerUp } from "./impl/PointerUp";

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
    }

    /**
     * handles pointer down events
     * @param event the original pointer event
     */
    private handlePointerDown(event: PointerEvent): void {

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
}
