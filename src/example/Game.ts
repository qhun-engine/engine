import { QhunGame } from "../engine/bootstrap/QhunGame";
import { EngineReadyMessage } from "../engine/message/internal/state/EngineReadyMessage";
import { Once } from "../engine/message/decorator/Once";
import { MainEntity } from "./MainEntity";
import { MainScene } from "./MainScene";
import { SceneManager } from "../engine/scene/SceneManager";
import { AnimationManager } from "../engine/animation/AnimationManager";
import { Injector } from "../engine/di/Injector";
import { TransitionContainer } from "../engine/animation/transition/TransitionContainer";

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
        private t: TransitionContainer
    ) { }

    @Once(EngineReadyMessage)
    private startGame(): void {
        (window as any).i = Injector.getInstance();
        const fighter = new MainEntity();
        const scene = new MainScene();

        this.animation.startAnimation(fighter, "idle");

        scene.addEntity(fighter);

        this.sceneMan.switchScene(scene);
    }
}
