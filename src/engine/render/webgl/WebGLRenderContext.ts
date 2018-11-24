import { RenderContext } from "../RenderContext";

/**
 * the webgl render context
 */
export class WebGLRenderContext implements RenderContext {

    constructor(
        private canvas: HTMLCanvasElement,
        private context: WebGLRenderingContext
    ) { }
}
