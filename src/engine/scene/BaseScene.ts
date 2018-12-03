import { Scene } from "./Scene";
import { Entity } from "../entity/Entity";
import { World } from "../world/World";
import { Camera } from "../camera/Camera";

/**
 * a simple scene object wich implements the boilerplate part of the Scene interface
 */
export abstract class BaseScene implements Scene {

    /**
     * indicator if the scene has done its loading phase
     */
    protected sceneLoaded: boolean = false;

    /**
     * the stack of currently existing entities in this scene
     */
    protected entities: Entity[] = [];

    /**
     * the currently active camera
     */
    protected camera!: Camera;

    /**
     * the current world for the scene
     */
    protected world!: World;

    /**
     * @inheritdoc
     */
    public isLoaded(): boolean {

        return this.sceneLoaded;
    }

    /**
     * @inheritdoc
     */
    public async loadScene(): Promise<void> {

        // load the world
        if (this.world) {

            // get resources for the world and load the layout
            await this.world.load();
        }

        // set flag
        this.sceneLoaded = true;

        return;
    }

    /**
     * @inheritdoc
     */
    public async unloadScene(): Promise<void> {

        // unload the world
        if (this.world) {
            this.world.destroy();
        }

        // set flag
        this.sceneLoaded = false;

        return;
    }

    /**
     * @inheritdoc
     */
    public addEntity(...entities: Entity[]): this {

        this.entities.push(...entities);
        return this;
    }

    /**
     * @inheritdoc
     */
    public getEntities(): Entity[] {

        return this.entities;
    }

    /**
     * @inheritdoc
     */
    public setCamera(camera: Camera): this {

        this.camera = camera;
        return this;
    }

    /**
     * @inheritdoc
     */
    public getCamera(): Camera | undefined {

        return this.camera;
    }

    /**
     * @inheritdoc
     */
    public setWorld(world: World): this {

        this.world = world;
        return this;
    }

    /**
     * @inheritdoc
     */
    public getWorld(): World | undefined {

        return this.world;
    }
}
