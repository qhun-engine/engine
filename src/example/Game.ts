import {
    QhunGame, SceneManager, AnimationManager, EngineReadyMessage,
    Once, Vector, FollowElasticCenterStrategy, On, Camera
} from "../engine";
import { OrthogonalWorld } from "./world/OrthogonalWorld";
import { MainEntity } from "./MainEntity";
import { MainScene } from "./MainScene";

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
    private async startOrthogonal(): Promise<void> {

        const world = new OrthogonalWorld();

        this.entity = new MainEntity();
        this.entity.setSize(Vector.from(
            this.entity.getTexture().width,
            this.entity.getTexture().height
        ));

        const scene = new MainScene().setWorld(world).addEntity(this.entity);

        await this.sceneMan.switchScene(scene);

        this.camera = world.createCamera();
        this.camera.follow(this.entity, new FollowElasticCenterStrategy(.5, .8));
        scene.setCamera(this.camera);
    }
}
