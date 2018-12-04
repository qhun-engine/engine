import { Injectable } from "@qhun-engine/base";

import { TransitionInBound } from "./TransitionInBound";

/**
 * implements a transition linear calculation
 */
@Injectable()
export class Linear implements TransitionInBound {

    public inBound: true = true;

    public calculate(x: number): number {

        // bases on f(x) = x
        return x;
    }
}
