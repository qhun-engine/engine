import { Injectable } from "../di/Injectable";
import { InputService } from "./InputService";
import { MessageBus } from "../message/MessageBus";
import { InputPoint } from "./generic/InputPoint";
import { Vector } from "../math/Vector";
import { InputPointDownMessage } from "../message/event/input/InputPointDownMessage";
import { InputPointDown } from "./generic/InputPointDown";
import { InputPointUp } from "./generic/InputPointUp";
import { InputPointUpMessage } from "../message/event/input/InputPointUpMessage";
import { InputPointMoveMessage } from "../message/event/input/InputPointMoveMessage";
import { InputPointMove } from "./generic/InputPointMove";

/**
 * handles mouse input
 */
@Injectable()
export class MouseInputService implements InputService {

    constructor(
        private messageBus: MessageBus
    ) { }

    /**
     * @inheritdoc
     */
    public startListening(): void {

        window.onmousedown = this.handleMouseDown.bind(this);
        window.onmouseup = this.handleMouseUp.bind(this);
        window.onmousemove = this.handleMouseMove.bind(this);
    }

    /**
     * handles the mouse down event
     * @param event the mouse down event
     */
    private handleMouseDown(event: MouseEvent) {

        const point = this.convertEventToPoint(event);
        this.messageBus.send(new InputPointDownMessage(
            new InputPointDown(point)
        ));
    }

    /**
     * handles the mouse up event
     * @param event the mouse up event
     */
    private handleMouseUp(event: MouseEvent) {

        const point = this.convertEventToPoint(event);
        this.messageBus.send(new InputPointUpMessage(
            new InputPointUp(point)
        ));
    }

    /**
     * handles the mouse move event
     * @param event the mouse move event
     */
    private handleMouseMove(event: MouseEvent) {

        const point = this.convertEventToPoint(event);
        this.messageBus.send(new InputPointMoveMessage(
            new InputPointMove(point)
        ));
    }

    /**
     * converts the given event to a generic input point
     * @param event the given event
     */
    private convertEventToPoint(event: MouseEvent): InputPoint {

        return Vector.from(
            event.clientX,
            event.clientY
        );
    }
}
