import { RectangleShape } from "../shape/RectangleShape";

export interface HasBounds {

    /**
     * get the rectangular bounds of this object
     */
    getBounds(): RectangleShape;
}
