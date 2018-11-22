import { Transition } from "./Transition";

/**
 * implements a transition linear calculation
 */
export class Linear implements Transition {

    public calculate(x: number): number {

        // bases on f(x) = x
        return x;
    }
}
