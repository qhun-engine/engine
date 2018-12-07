import { UIAnchor } from "./UIAnchor";
import { HasPosition } from "../constraint/HasPosition";
import { HasSize } from "../constraint/HasSize";
import { HasLayer } from "../constraint/HasLayer";

export interface UIElement extends HasPosition, HasSize, HasLayer {

    /**
     * the anchor of the ui element
     */
    getAnchor(): UIAnchor;

    /**
     * get the parent ui element if any
     */
    getParent(): UIElement | void;

    /**
     * get all children of this element
     */
    getChildren(): UIElement[];

}
