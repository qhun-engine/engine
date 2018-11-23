import { EaseIn } from "./EaseIn";
import { EaseOut } from "./EaseOut";
import { EaseInOut } from "./EaseInOut";
import { Linear } from "./Linear";
import { Injectable } from "../../di/Injectable";

/**
 * creates and reuses transition implementations
 */
@Injectable()
export class TransitionContainer {

    constructor(
        private easeIn: EaseIn,
        private easeOut: EaseOut,
        private easeInOut: EaseInOut,
        private linear: Linear
    ) { }

    public getEaseIn(): EaseIn {
        return this.easeIn;
    }

    public getEaseOut(): EaseOut {
        return this.easeOut;
    }

    public getEaseInOut(): EaseInOut {
        return this.easeInOut;
    }

    public getLinear(): Linear {
        return this.linear;
    }
}
