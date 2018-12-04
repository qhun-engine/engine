import { Transition } from "./Transition";

/**
 * A transitioning class that calculates within the bounds of 0 to 1
 */
export interface TransitionInBound extends Transition {

    /**
     * marker property to stay in bounds
     */
    inBound: true;
}
