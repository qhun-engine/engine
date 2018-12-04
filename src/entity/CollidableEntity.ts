import { Entity } from "./Entity";
import { CollisionType } from "../collision/CollisionType";

/**
 * an entity that can collide with other objects
 */
export interface CollidableEntity extends Entity {

    /**
     * get the collision type of the entity
     */
    getCollisionType(): CollisionType;

    /**
     * set the new collision type for this entity
     * @param type the new collision type
     */
    setCollisionType(type: CollisionType): ThisType<CollidableEntity>;

    /**
     * set to true if the collision detection system should ignore this entity, false otherwise
     * @param ignoreCollision the new collision state
     */
    setCollisionIgnore(ignoreCollision: boolean): ThisType<CollidableEntity>;

    /**
     * test if this collidable entity should be ignored during collision detection
     */
    isCollisionIgnored(): boolean;
}
