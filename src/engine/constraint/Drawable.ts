import { RenderContext } from "../render/RenderContext";
import { Engine } from "../Engine";

/**
 * can be drawn in the game loop
 */
export interface Drawable {

    /**
     * will be called during the main game loop after receiving user input and after `Updateable` methods are called
     * @param delta the time in milliseconds passed since the last draw (stepwise)
     * @param timeDelta the read time passed since the last frame draw
     * @param renderer the currently active renderer
     * @param engine the engine object
     */
    draw(delta: number, timeDelta: number, renderer: RenderContext, engine: Engine): void;
}
