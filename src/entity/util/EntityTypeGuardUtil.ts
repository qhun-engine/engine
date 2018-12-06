import { Injectable } from "@qhun-engine/base";
import { Entity } from "../Entity";
import { MovableEntity } from "../MovableEntity";

/**
 * a util class to call type guard function on existing entities
 */
@Injectable()
export class EntityTypeGuardUtil {

    /**
     * test if the given entity is a `MovingEntity`
     * @param entity the entity to check
     */
    public isMovingEntity(entity: Entity): entity is MovableEntity {

        const functions: (keyof MovableEntity)[] = ["getSpeed", "getVelocity", "move", "setSpeed", "setVelocity"];
        return EntityTypeGuardUtil.functionsExists(functions, entity as MovableEntity);
    }

    /**
     * test if the given function names exist on the given entity
     * @param functionNames the function names
     * @param object the entity object
     */
    private static functionsExists<T>(functionNames: (keyof T)[], object: T): boolean {

        return functionNames.every(fktn => typeof object[fktn] === "function");
    }
}
