import { EventMessage } from "../EventMessage";
import { InputPointMove } from "../../../input/generic/InputPointMove";

/**
 * indicates a generic mousemove or touchmove
 */
export class InputPointMoveMessage extends EventMessage<InputPointMove> { }
