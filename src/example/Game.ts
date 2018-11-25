import { QhunGame } from "../engine/bootstrap/QhunGame";
import { SceneManager } from "../engine/scene/SceneManager";
import { ResourceManager } from "../engine/resource/ResourceManager";
import { MainEntity } from "./MainEntity";
import { MainScene } from "./MainScene";
import { Engine } from "../engine/Engine";
import { Vector } from "../engine/math/Vector";

@QhunGame({
    exposeGameInstance: true,
    renderer: "canvas",
    debugMode: true
})
class Game {

    constructor(
        private sm: SceneManager,
        private rm: ResourceManager,
        private engine: Engine
    ) {

        const man = new MainEntity();
        man.setPosition(Vector.from(engine.getCanvasObject().width / 2, engine.getCanvasObject().height / 2));

        const scene = new MainScene();
        scene.addEntity(man);
        sm.switchScene(scene);

        man.playAnimation("idle");

        setInterval(() => {
            man.setRotation(man.getRotation() + .01);
        }, 10);
    }
}
