import { QhunGame } from "../engine/bootstrap/QhunGame";
import { SceneManager } from "../engine/scene/SceneManager";
import { ResourceManager } from "../engine/resource/ResourceManager";
import { MainEntity } from "./MainEntity";
import { MainScene } from "./MainScene";
import { Engine } from "../engine/Engine";
import { Vector } from "../engine/math/Vector";

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

        this.rm.loadSprite("assets/fighter.png", "assets/fighter.json").then(anim => {

            const man = new MainEntity();
            man.setTexture(anim.getAnimationImages()[0]);
            man.setPosition(Vector.from(50, 50));
            man.addAnimation("idle", anim);

            const scene = new MainScene();
            scene.addEntity(man);
            sm.switchScene(scene);

            const animCtrl = man.playAnimation("idle");
            (window as any).anim = animCtrl;
            animCtrl.setSpeed(60);

            setInterval(() => {
                man.setRotation(man.getRotation() + .01);
            }, 10);
        });
    }
}
