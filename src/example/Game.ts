import { QhunGame } from "../engine/bootstrap/QhunGame";
import { EngineReadyMessage } from "../engine/message/internal/state/EngineReadyMessage";
import { Once } from "../engine/message/decorator/Once";
import { MainEntity } from "./MainEntity";
import { MainScene } from "./MainScene";
import { SceneManager } from "../engine/scene/SceneManager";

@QhunGame({
    exposeGameInstance: true,
    renderer: "canvas",
    debugMode: true,
    fps: 20
})
class Game {

    constructor(
        private sceneMan: SceneManager
    ) {

        console.log(sceneMan);
    }

    @Once(EngineReadyMessage)
    private startGame(): void {

        const fighter = new MainEntity();
        const scene = new MainScene();

        scene.addEntity(fighter);

        this.sceneMan.switchScene(scene);
    }
}
