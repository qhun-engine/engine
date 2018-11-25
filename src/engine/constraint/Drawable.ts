import { RenderContext } from "../render/RenderContext";
import { Engine } from "../Engine";

/**
 * can be drawn in the game loop
 */
export interface Drawable {

    /**
     * will be called during the main game loop after receiving user input and after `Updateable` methods are called
     * @param delta the time in milliseconds passed since the last update
     * @param renderer the currently active renderer
     * @param engine the engine object
     */
    draw(delta: number, renderer: RenderContext, engine: Engine): void;
}
