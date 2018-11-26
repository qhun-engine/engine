import { Updateable } from "../constraint/Updateable";
import { Drawable } from "../constraint/Drawable";
import { Entity } from "../entity/Entity";
import { TileWorld } from "../resource/tileset/TileWorld";

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
    setTileWorld(world: TileWorld): ThisType<Scene>;

    /**
     * get the currently active tile world
     */
    getTileWorld(): TileWorld | undefined;

    /**
     * get all entities in this scene
     */
    getEntities(): Entity[];
}
