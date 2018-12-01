import { Updateable } from "../constraint/Updateable";
import { Drawable } from "../constraint/Drawable";
import { Entity } from "../entity/Entity";
import { Tileworld } from "../resource/tileset/Tileworld";

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
     * set the tile map based world for this scene
     * @param world the world to set
     */
    setTileworld(world: Tileworld): ThisType<Scene>;

    /**
     * get the currently active tile world
     */
    getTileworld(): Tileworld | undefined;

    /**
     * get all entities in this scene
     */
    getEntities(): Entity[];
}
