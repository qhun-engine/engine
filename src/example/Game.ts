import { QhunGame } from "../engine/bootstrap/QhunGame";
import { SceneManager } from "../engine/scene/SceneManager";
import { ResourceManager } from "../engine/resource/ResourceManager";
import { MainEntity } from "./MainEntity";
import { MainScene } from "./MainScene";
import { Engine } from "../engine/Engine";

@QhunGame({
    exposeGameInstance: true,
    renderer: "canvas"
})
class Game {

    constructor(
        private sm: SceneManager,
        private rm: ResourceManager,
        private engine: Engine
    ) {

        this.rm.loadSprite("assets/Megaman.png", "assets/Megaman.json").then(anim => {

            const man = new MainEntity();
            man.addAnimation("idle", anim);

            const scene = new MainScene();
            scene.addEntity(man);
            sm.switchScene(scene);

            const animCtrl = man.playAnimation("idle");
            (window as any).anim = animCtrl;
        });
    }
}
