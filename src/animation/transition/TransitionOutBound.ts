import { Transition } from "./Transition";

/**
 * A transitioning class that calculates outside of the bounds from 0 to 1 (elasic transitions for example)
 */
export interface TransitionOutBound extends Transition {

    /**
     * marker property that this transition can be of bounds
     */
    inBound: false;
}
