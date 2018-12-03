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
import { EntityTypeGuardUtil } from "../entity/util/EntityTypeGuardUtil";
import { ConsoleLoggerPrefix } from "../debug/ConsoleLoggerPrefix";
import { ConsolePerformanceLogger } from "../debug/ConsolePerformanceLogger";

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
    private perspectiveRenderer!: TilePerspectiveRendering;

    constructor(
        private messageBus: MessageBus,
        private tilePerspectiveRenderingFactory: TilePerspectiveRenderingFactory,
        private entityTypeGuard: EntityTypeGuardUtil,
        private logger: ConsolePerformanceLogger
    ) { }

    /**
     * loads the given scene with its content into the memory but **dont** switches to this scene when its loaded
     * @param scene the scene to load
     */
    public async loadScene(scene: Scene): Promise<void> {

        // log the scene load info
        this.logger.printGrey(`Loading scene ${scene.constructor.name}...`, ConsoleLoggerPrefix.Scene);

        return scene.loadScene().then(() => {

            // scene has been loaded
            this.logger.printBlack(`Scene ${scene.constructor.name} has been loaded.`, ConsoleLoggerPrefix.Scene);

            // send the message
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
        const world = scene.getWorld();
        if (world) {

            // get the perspective renderer
            const perspective = world.getPerspective();
            this.perspectiveRenderer = this.tilePerspectiveRenderingFactory.createByPerspective(perspective);
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
        if (!this.activeScene || !this.activeScene.isLoaded()) {
            return;
        }

        // get delta per second
        const deltaSecond = delta / 1000;

        // apply entities velocity to position
        this.activeScene.getEntities()
            // only get movable entities
            .filter(this.entityTypeGuard.isMovingEntity)
            // iterate over these
            .forEach(entity => {

                // get entities velocity and friction
                const velocity = entity.getVelocity();
                const friction = entity.getFriction();

                // scale the velocity vector by the friction amount and the delta amount of the draw process
                const tempVelocity = velocity.scale(friction).scale(deltaSecond);

                // set new position of the entity
                entity.setPosition(entity.getPosition().add(tempVelocity));
                entity.setVelocity(velocity.substract(tempVelocity));

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
        if (!this.activeScene || !this.activeScene.isLoaded()) {
            return;
        }

        // set camera
        const camera = this.activeScene.getCamera();
        if (camera) {

            // use the refreshed camera
            renderer.useCamera(camera);
        }

        // draw world if available
        const world = this.activeScene.getWorld();
        if (world) {

            // use world before drawing
            renderer.useWorld(world);
            renderer.usePerspectiveRenderer(this.perspectiveRenderer);

            // draw the world
            renderer.drawTileWorld(world.getRenderableWorld());
        }

        // iterate over the entities and draw them
        this.activeScene.getEntities()
            .filter(entity => renderer.isEntityRenderable(entity))
            .forEach(entity => renderer.drawEntity(entity as RenderableEntity));
    }
}
