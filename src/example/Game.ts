import { QhunGame } from "../engine/bootstrap/QhunGame";
import { EngineReadyMessage } from "../engine/message/internal/state/EngineReadyMessage";
import { Once } from "../engine/message/decorator/Once";
import { MainEntity } from "./MainEntity";
import { MainScene } from "./MainScene";
import { SceneManager } from "../engine/scene/SceneManager";
import { AnimationManager } from "../engine/animation/AnimationManager";
import { TransitionContainer } from "../engine/animation/transition/TransitionContainer";
import { Entity } from "../engine/entity/Entity";
import { Vector } from "../engine/math/Vector";
import { Random } from "../engine/math/Random";
import { Renderable } from "../engine/constraint/Renderable";

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

        const rand = new Random();
        const entities: (Renderable & Entity)[] = [];
        for (let i = 0; i < 2; i++) {

            const fighter = new MainEntity();
            fighter.setPosition(Vector.from(
                rand.getBetween(0, 800),
                rand.getBetween(0, 800)
            ));
            entities.push(fighter);
        }

        const scene = new MainScene();
        scene.addEntity(...entities);

        entities.forEach(entity => {
            setTimeout(() => {

                this.animation.startAnimation(entity, "idle");
            }, rand.getBetween(0, 1000));
        });

        this.sceneMan.switchScene(scene);
    }
}
