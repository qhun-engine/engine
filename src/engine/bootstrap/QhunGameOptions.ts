export interface QhunGameOptions {

    /**
     * exposes the instance object on `window.game` to
     * access class specific objects on runtime
     * @default false
     */
    exposeGameInstance: boolean;

    /**
     * the id of the html canvas element where to render your game.
     * this can be omitted when using the builtin server infrastructure
     * @default qhunGameCanvas
     */
    canvasId: string;
}
