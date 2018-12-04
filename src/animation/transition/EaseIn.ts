import { Injectable } from "../../di/Injectable";
import { TransitionInBound } from "./TransitionInBound";

/**
 * implements a transition ease in calculation
 */
@Injectable()
export class EaseIn implements TransitionInBound {

    public inBound: true = true;

    public calculate(x: number): number {

        // based on f(x) = x^2/(x+(1-x)^2)
        return x ** 2 / (x + (1 - x) ** 2);
    }
}
