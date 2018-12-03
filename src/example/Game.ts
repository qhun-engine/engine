import {
    QhunGame, SceneManager, AnimationManager, EngineReadyMessage,
    Once, Vector, FollowElasticCenterStrategy, On, Camera
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

    private entity!: MainEntity;
    private camera!: Camera;

    constructor(
        private sceneMan: SceneManager,
        private anim: AnimationManager
    ) {

        // noop
    }

    @Once(EngineReadyMessage)
    private startOrthogonal(): void {

        const world = new OrthogonalWorld();
        this.entity = new MainEntity();
        this.entity.setSize(Vector.from(
            this.entity.getTexture().getData().width,
            this.entity.getTexture().getData().height
        ));

        const scene = new MainScene().setTileworld(world).addEntity(this.entity);

        this.camera = world.createCamera();
        this.camera.follow(this.entity, new FollowElasticCenterStrategy(.5, .8));
        scene.setCamera(this.camera);

        this.sceneMan.switchScene(scene);
    }
}
