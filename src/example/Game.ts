import { QhunGame } from "../engine/bootstrap/QhunGame";
import { EngineReadyMessage } from "../engine/message/internal/state/EngineReadyMessage";
import { Once } from "../engine/message/decorator/Once";
import { MainEntity } from "./MainEntity";
import { MainScene } from "./MainScene";
import { SceneManager } from "../engine/scene/SceneManager";
import { AnimationManager } from "../engine/animation/AnimationManager";
import { TransitionContainer } from "../engine/animation/transition/TransitionContainer";
import { ResourceLoader } from "../engine/resource/ResourceLoader";
import { TileworldChunkedResource } from "../engine/resource/tileset/TileworldChunkedResource";
import { MainWorld } from "./MainWorld";

@QhunGame({
    exposeGameInstance: true,
    renderer: "canvas",
    debugMode: true,
    fps: 60
})
class Game {

    constructor(
        private sceneMan: SceneManager,
        private animation: AnimationManager,
        private t: TransitionContainer,
        private resourceLoader: ResourceLoader
    ) {

        // noop
    }

    @Once(EngineReadyMessage)
    private startGame(): void {

        const world = new MainWorld();
        const scene = new MainScene();

        scene.setTileworld(world);
        this.sceneMan.switchScene(scene);
    }
}
