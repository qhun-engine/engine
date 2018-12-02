import { Injectable } from "../di/Injectable";
import { MessageBus } from "../message/MessageBus";
import { MouseInputService } from "./MouseInputService";
import { TouchInputService } from "./TouchInputService";

/**
 * a registry class to register known input ways to tell
 * the engine what kind of input just received by transforming it
 * into a generic input system that is indipendend of beeing input from
 * touch, mouse or a gamepad ...
 */
@Injectable()
export class InputRegistar {

    private supportTouchInput: boolean = false;
    private supportMouseInput: boolean = false;

    constructor(
        private mouseInput: MouseInputService,
        private touchInput: TouchInputService
    ) { }

    /**
     * detect the input capabilities of the current browser
     */
    public detectBrowserInputCapabilities(): void {

        // detect mouse support
        this.supportMouseInput = "onmousedown" in window;

        // detect touch support
        this.supportTouchInput = "ontouchstart" in window;

        // enable listeners
        if (this.supportMouseInput) {
            this.mouseInput.startListening();
        }

        if (this.supportTouchInput) {
            this.touchInput.startListening();
        }
    }
}
