import { RenderContext } from "../RenderContext";
import { Singleton } from "../../constraint/Singleton";

/**
 * the canvas rendering context
 */
@Singleton()
export class CanvasRenderContext implements RenderContext {

    constructor(
        private canvas: HTMLCanvasElement,
        private context: CanvasRenderingContext2D
    ) { }
}
