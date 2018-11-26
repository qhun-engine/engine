import { Engine } from "../Engine";

/**
 * can be updated in the game loop
 */
export interface Updateable {

    /**
     * will be called in the main game loop after receiving user input and before `Drawable` methods are called
     * @param delta the time in milliseconds passed since the last update (stepwise)
     * @param timeDelta the real time passed since the last frame update
     * @param engine the engine object
     */
    update(delta: number, timeDelta: number, engine: Engine): void;
}
