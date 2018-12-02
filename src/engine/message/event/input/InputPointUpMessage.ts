import { EventMessage } from "../EventMessage";
import { InputPointUp } from "../../../input/generic/InputPointUp";

/**
 * indicates a generic mouseup or touchend event
 */
export class InputPointUpMessage extends EventMessage<InputPointUp> { }
