import { Injectable } from "../di/Injectable";
import { Scene } from "./Scene";
import { MessageBus } from "../message/MessageBus";
import { SceneLoadedMessage } from "../message/event/scene/SceneLoadedMessage";
import { SceneSwitchedMessage } from "../message/event/scene/SceneSwitchedMessage";
import { SceneUnloadedMessage } from "../message/event/scene/SceneUnloadedMessage";
import { Updateable } from "../constraint/Updateable";
import { Drawable } from "../constraint/Drawable";
import { Engine } from "../Engine";
import { RenderContext } from "../render/RenderContext";
import { RenderableEntity } from "../entity/RenderableEntity";
import { TilePerspectiveRendering } from "../render/util/TileRendering";
import { TilePerspectiveRenderingFactory } from "../render/util/TileRenderingFactory";
import { Vector } from "../math/Vector";

/**
 * the scene manager is responsable for loading a scene with its actors, switching between scenes and
 * unloading current scenes
 */
@Injectable()
export class SceneManager implements Updateable, Drawable {

    /**
     * the currently active scene
     */
    private activeScene!: Scene;

    /**
     * the previous scene
     */
    private previousScene!: Scene;

    /**
     * if a tile world is added, this perspective renderer is needed
     * to draw the world in the correct perspective
     */
    private currentTileRenderer!: TilePerspectiveRendering;

    constructor(
        private messageBus: MessageBus,
        private tilePerspectiveRenderingFactory: TilePerspectiveRenderingFactory
    ) { }

    /**
     * loads the given scene with its content into the memory but **dont** switches to this scene when its loaded
     * @param scene the scene to load
     */
    public async loadScene(scene: Scene): Promise<void> {

        return scene.loadScene().then(() => {
            this.messageBus.send(new SceneLoadedMessage(scene));
        });
    }

    /**
     * unloads the given scene and frees the memory for resources
     * @param scene the scene to load
     */
    public async unloadScene(scene: Scene): Promise<void> {

        return scene.unloadScene().then(() => {
            this.messageBus.send(new SceneUnloadedMessage(scene));
        });
    }

    /**
     * switches to the given scene. the current scene will be unloaded after the given scene has been
     * active.
     * @param scene the scene to switch to
     * @param unloadPrevious unloads the previous theme to free memory
     */
    public async switchScene(scene: Scene, unloadPrevious: boolean = true): Promise<void> {

        // check if the scene has been loaded
        if (!scene.isLoaded()) {

            await this.loadScene(scene);
        }

        // get the world if any exists
        const tileWorld = scene.getTileworld();
        if (tileWorld) {

            // get the perspective renderer
            // @todo: refactor this unessesary long getter chaining!
            const perspective = tileWorld.getRenderableWorld().getResource().getData().getData().map.__orientation;
            this.currentTileRenderer = this.tilePerspectiveRenderingFactory.createByPerspective(perspective);
        }

        // set as active
        this.previousScene = this.activeScene;
        this.activeScene = scene;

        // send scene switched message
        this.messageBus.send(new SceneSwitchedMessage(scene, this.previousScene));

        // unload the previous scene
        if (unloadPrevious && this.previousScene) {

            // unload but dont await the unloading
            this.unloadScene(this.previousScene);
        }
    }

    /**
     * @inheritdoc
     */
    public update(delta: number, timeDelta: number, engine: Engine): void {

        // dont update if there is no active scene
        if (!this.activeScene) {
            return;
        }

        // apply entities velocity to position
        const deltaVector = Vector.from(delta / 1000);
        this.activeScene.getEntities().forEach(entity => {

            const deltaVelocity = entity.getVelocity().multiply(deltaVector);
            entity.setPosition(entity.getPosition().add(deltaVelocity));
            entity.setVelocity(entity.getVelocity().substract(deltaVelocity));
        });

        const camera = this.activeScene.getCamera();
        if (camera) {

            // update camera
            camera.update(delta);
        }
    }

    /**
     * @inheritdoc
     */
    public draw(delta: number, timeDelta: number, renderer: RenderContext, engine: Engine): void {

        // dont draw if there is no active scene
        if (!this.activeScene) {
            return;
        }

        // set camera
        const camera = this.activeScene.getCamera();
        if (camera) {

            // use the refreshed camera
            renderer.useCamera(camera);
        }

        // draw world if available
        const world = this.activeScene.getTileworld();
        if (world) {
            renderer.drawTileWorld(world.getRenderableWorld(), this.currentTileRenderer);
        }

        // iterate over the entities and draw them
        this.activeScene.getEntities()
            .filter(entity => renderer.isEntityRenderable(entity))
            .forEach(entity => renderer.drawEntity(entity as RenderableEntity));
    }
}
