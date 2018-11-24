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

    /**
     * the rendering method that should be used when rendering your application.
     * auto is used to detect the capabilities of the user's browser and chooses the
     * best available engine
     * @default "auto"
     */
    renderer: "auto" | "canvas" | "webgl";
}
