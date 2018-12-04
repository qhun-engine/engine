import { Injectable } from "@qhun-engine/base";

import { Transition } from "./Transition";

/**
 * implements a transition ease in elastic calculation
 */
@Injectable()
export class EaseInElastic implements Transition {

    public calculate(x: number): number {

        return (.04 - .04 / x) * Math.sin(25 * x) + 1;
    }
}
