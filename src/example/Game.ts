import {
    QhunGame, SceneManager, AnimationManager, EngineReadyMessage,
    Once, Vector, FollowElasticCenterStrategy, On, Camera
} from "../engine";
import { OrthogonalWorld } from "./world/OrthogonalWorld";
import { MainEntity } from "./MainEntity";
import { MainScene } from "./MainScene";
import { IsometricWorld } from "./world/IsometricWorld";
import { InputPointDownMessage } from "../engine/message/event/input/InputPointDownMessage";
import { InputPointMoveMessage } from "../engine/message/event/input/InputPointMoveMessage";

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

    @On(InputPointDownMessage)
    private moveEntity(message: InputPointDownMessage): void {

        // use the camera to cast a ray into the world
        const ray = this.camera.screenToRay(message.getPayload());
        console.log(ray);
        let pos = ray.getCartesianMapPosition();

        // center entity to calculated position
        pos = pos.substract(this.entity.getSize().half());

        this.entity.move(pos);
    }

    /*@On(InputPointMoveMessage)
    private selectTile(message: InputPointMoveMessage): void {

        // raycast to tile
        const ray = this.camera.screenToRay(message.getPayload());
    }*/

    // @Once(EngineReadyMessage)
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

    @Once(EngineReadyMessage)
    private startIsometric(): void {

        const world = new IsometricWorld();
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
