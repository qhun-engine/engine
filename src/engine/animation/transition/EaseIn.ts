import { Transition } from "./Transition";

/**
 * implements a transition ease in calculation
 */
export class EaseIn implements Transition {

    public calculate(x: number): number {

        // based on f(x) = x^2/(x+(1-x)^2)
        return x ** 2 / (x + (1 - x) ** 2);
    }
}
