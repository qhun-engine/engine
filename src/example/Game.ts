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
import { ResourceLoader } from "../engine/resource/ResourceLoader";
import { XmlTextResource } from "../engine/resource/text/XmlTestResource";
import { Threaded } from "../engine/therad/Threaded";

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

        this.resourceLoader.declare(this.resourceLoader.loadText, "assets/world/mainWorld.tmx", XmlTextResource).then(world => {

            console.log(world);
        });
    }

    @Threaded()
    private async xmlTest(x: number): Promise<any> {

        const fibonacci = (num: number) => {
            let result = 0;
            if (num < 2) {
                result = num;
            } else {
                result = fibonacci(num - 1) + fibonacci(num - 2);
            }
            return result;
        };
        return fibonacci(x);
    }

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

        this.xmlTest(45).then(e => {
            console.log(e);
        });

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
