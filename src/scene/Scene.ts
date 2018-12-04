import { Updateable } from "../constraint/Updateable";
import { Drawable } from "../constraint/Drawable";
import { Entity } from "../entity/Entity";
import { World } from "../world/World";
import { Camera } from "../camera/Camera";

export interface Scene extends Partial<Updateable>, Partial<Drawable> {

    /**
     * check if this scene is currently loaded
     */
    isLoaded(): boolean;

    /**
     * load the scene and aquire resources
     */
    loadScene(): Promise<void>;

    /**
     * unload the scene and free some resources, destroy entities ...
     */
    unloadScene(): Promise<void>;

    /**
     * add the given entities to the scene
     * @param entities the entities to add
     */
    addEntity(...entities: Entity[]): ThisType<Scene>;

    /**
     * set the world for this scene
     * @param world the world to set
     */
    setWorld(world: World): ThisType<Scene>;

    /**
     * set the camera to the scene
     * @param camera the camera to set
     */
    setCamera(camera: Camera): ThisType<Scene>;

    /**
     * get the currently active camera
     */
    getCamera(): Camera | undefined;

    /**
     * get the currently active world
     */
    getWorld(): World | undefined;

    /**
     * get all entities in this scene
     */
    getEntities(): Entity[];
}
