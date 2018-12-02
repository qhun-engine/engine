import { EventMessage } from "../EventMessage";
import { InputPointDown } from "../../../input/generic/InputPointDown";

/**
 * indicates a generic mousedown or touchstart event
 */
export class InputPointDownMessage extends EventMessage<InputPointDown> { }
