import {
    QhunGame, SceneManager, AnimationManager, EngineReadyMessage,
    Once, Vector, FollowElasticCenterStrategy
} from "../engine";
import { OrthogonalWorld } from "./world/OrthogonalWorld";
import { MainEntity } from "./MainEntity";
import { MainScene } from "./MainScene";
import { IsometricWorld } from "./world/IsometricWorld";

@QhunGame({
    exposeGameInstance: true,
    renderer: "canvas",
    debugMode: true,
    fps: 60
})
class Game {

    constructor(
        private sceneMan: SceneManager,
        private anim: AnimationManager
    ) {

        // noop
    }

    @Once(EngineReadyMessage)
    private startOrthogonal(): void {

        const world = new OrthogonalWorld();
        const entity = new MainEntity();
        entity.setSize(Vector.from(
            entity.getTexture().getData().width,
            entity.getTexture().getData().height
        ));

        const scene = new MainScene().setTileworld(world).addEntity(entity);

        const camera = world.createCamera();
        camera.follow(entity, new FollowElasticCenterStrategy(.5, .8));
        scene.setCamera(camera);

        this.sceneMan.switchScene(scene);

        window.addEventListener("keydown", (e) => {
            switch (e.keyCode) {
                case 37: // left arrow
                    entity.setPosition(entity.getPosition().add(Vector.from(-30, 0)));
                    break;
                case 38: // up arrow
                    entity.setPosition(entity.getPosition().add(Vector.from(0, -30)));
                    break;
                case 39: // right arrow
                    entity.setPosition(entity.getPosition().add(Vector.from(30, 0)));
                    break;
                case 40: // down arrow
                    entity.setPosition(entity.getPosition().add(Vector.from(0, 30)));
                    break;
            }
        }, false);
    }

    // @Once(EngineReadyMessage)
    private startIsometric(): void {

        const world = new IsometricWorld();
        const entity = new MainEntity();
        entity.setSize(Vector.from(
            entity.getTexture().getData().width,
            entity.getTexture().getData().height
        ));

        const scene = new MainScene().setTileworld(world).addEntity(entity);

        const camera = world.createCamera();
        camera.follow(entity);
        scene.setCamera(camera);

        this.sceneMan.switchScene(scene);

        window.addEventListener("keydown", (e) => {
            switch (e.keyCode) {
                case 37: // left arrow
                    entity.setPosition(entity.getPosition().add(Vector.from(-30, 0)));
                    break;
                case 38: // up arrow
                    entity.setPosition(entity.getPosition().add(Vector.from(0, -30)));
                    break;
                case 39: // right arrow
                    entity.setPosition(entity.getPosition().add(Vector.from(30, 0)));
                    break;
                case 40: // down arrow
                    entity.setPosition(entity.getPosition().add(Vector.from(0, 30)));
                    break;
            }
        }, false);
    }
}
