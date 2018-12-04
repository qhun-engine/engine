import { HasPosition } from "../../constraint/HasPosition";
import { HasSize } from "../../constraint/HasSize";
import { HasCenter } from "../../constraint/HasCenter";

/**
 * representa a followable object
 */
export interface Followable extends HasPosition, HasSize, HasCenter { }
