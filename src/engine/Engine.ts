import { Injectable } from "./di/Injectable";
import { RenderContext } from "./render/RenderContext";

@Injectable()
export class Engine {

    /**
     * the render context instance
     */
    private renderContent!: RenderContext;

    /**
     * the main game canvas object
     */
    private canvasObject!: HTMLCanvasElement;

    /**
     * set the new render context
     * @param context the new context
     */
    public setRenderContext(context: RenderContext): this {

        this.renderContent = context;
        return this;
    }

    /**
     * set the new canvas object
     * @param context the new canvas object
     */
    public setCanvasObject(canvas: HTMLCanvasElement): this {

        this.canvasObject = canvas;
        return this;
    }
}
