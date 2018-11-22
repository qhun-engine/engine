import { Transition } from "./Transition";

/**
 * implements a transition ease in out calculation
 */
export class EaseInOut implements Transition {

    public calculate(x: number): number {

        // based on f(x) = x^2 / (x^2 + (1 - x)^2)
        return x ** 2 / (x ** 2 + (1 - x) ** 2);
    }
}
