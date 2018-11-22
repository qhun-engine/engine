import { EaseIn } from "./EaseIn";
import { EaseOut } from "./EaseOut";
import { EaseInOut } from "./EaseInOut";
import { Linear } from "./Linear";

/**
 * creates and reuses transition implementations
 */
export class TransitionFactory {

    private static easeInTransitionInstance: EaseIn;
    private static easeOutTransitionInstance: EaseOut;
    private static easeInOutTransitionInstance: EaseInOut;
    private static linearTransitionInstance: Linear;

    /**
     * creates an ease-in transition
     */
    public static createEaseIn(): EaseIn {
        if (!TransitionFactory.easeInTransitionInstance) {
            TransitionFactory.easeInTransitionInstance = new EaseIn();
        }
        return TransitionFactory.easeInTransitionInstance;
    }

    /**
     * creates an ease-out transition
     */
    public static createEaseOut(): EaseOut {
        if (!TransitionFactory.easeOutTransitionInstance) {
            TransitionFactory.easeOutTransitionInstance = new EaseOut();
        }
        return TransitionFactory.easeOutTransitionInstance;
    }

    /**
     * creates an ease-in-out transition
     */
    public static createEaseInOut(): EaseInOut {
        if (!TransitionFactory.easeInOutTransitionInstance) {
            TransitionFactory.easeInOutTransitionInstance = new EaseInOut();
        }
        return TransitionFactory.easeInOutTransitionInstance;
    }

    /**
     * creates a linear transition
     */
    public static createLinear(): Linear {
        if (!TransitionFactory.linearTransitionInstance) {
            TransitionFactory.linearTransitionInstance = new Linear();
        }
        return TransitionFactory.linearTransitionInstance;
    }
}
