import { QhunGame } from "../engine/bootstrap/QhunGame";
import { EngineReadyMessage } from "../engine/message/internal/state/EngineReadyMessage";
import { Once } from "../engine/message/decorator/Once";
import { MainScene } from "./MainScene";
import { SceneManager } from "../engine/scene/SceneManager";
import { IsometricWorld } from "./world/IsometricWorld";

@QhunGame({
    exposeGameInstance: true,
    renderer: "canvas",
    debugMode: true,
    fps: 60
})
class Game {

    constructor(
        private sceneMan: SceneManager
    ) {

        // noop
    }

    /*//@Once(EngineReadyMessage)
    private startOrthogonal(): void {

        const world = new OrthogonalWorld();
        const scene = new MainScene().setTileworld(world);

        this.sceneMan.switchScene(scene);
    }*/

    @Once(EngineReadyMessage)
    private startIsometric(): void {

        const world = new IsometricWorld();
        const scene = new MainScene().setTileworld(world);

        this.sceneMan.switchScene(scene);
    }
}
