import { Injectable } from "@qhun-engine/base";
import { MessageBus } from "../message/MessageBus";
import { EntityTypeGuardUtil } from "../entity/util/EntityTypeGuardUtil";
import { shapeFromCollidableEntity } from "./shapeFromCollidableEntity";
import { CollisionWithEntityDetectedMessage } from "./messages/CollisionWithEntityDetectedMessage";
import { CollisionWithWorldDetectedMessage } from "./messages/CollisionWithWorldDetectedMessage";
import { Entity } from "../entity/Entity";
import { World } from "../world/World";

@Injectable()
export class CollisionDetector {

    constructor(
        private messageBus: MessageBus,
        private entityTypeGuard: EntityTypeGuardUtil
    ) { }

    /**
     * check if one of the given entities collides with another given entity
     * @param entities the entities to check for
     */
    public hitTestEntityWithEntity(entities: Entity[]): void {

        // only get entities that can collide
        const entityStack = entities
            .filter(this.entityTypeGuard.isCollidableEntity)
            .filter(entity => !entity.isCollisionIgnored())
            .map(entity => {
                return {
                    entity,
                    bounds: shapeFromCollidableEntity(entity).getBounds()
                };
            });

        // there must be at least two entities to test against
        if (entityStack.length < 2) {
            return;
        }

        // now make the git test
        for (let i = 0; i < entityStack.length; i++) {
            for (let j = 0; i < entityStack.length; j++) {

                // check if the boxes overleaps each other
                if (entityStack[i].bounds.overlaps(entityStack[j].bounds) && entityStack[i] !== entityStack[j]) {

                    // entities collided!
                    this.messageBus.send(new CollisionWithEntityDetectedMessage(
                        entityStack[i].entity,
                        entityStack[j].entity
                    ));
                }
            }
        }
    }

    /**
     * make a hit test for given entities with the world
     * @param entities all entities to test
     * @param world the world layout with blocked information
     * @param collideWithWorldBounds flag if entities can collide with the world bounds
     */
    public hitTestEntityWithWorld(entities: Entity[], world: World, collideWithWorldBounds?: boolean): void {

        // only get entities that can collide
        const entityStack = entities
            .filter(this.entityTypeGuard.isCollidableEntity)
            .filter(entity => !entity.isCollisionIgnored())
            .filter(this.entityTypeGuard.isMovingEntity)
            .map(entity => {

                const tmpVector = entity.getPosition().divide(world.getTileSize());
                return {
                    entity,
                    pos: tmpVector.setXY(Math.floor(tmpVector.x), Math.floor(tmpVector.y)),
                    bounds: shapeFromCollidableEntity(entity).getBounds()
                };
            });

        for (let layer = 0; layer < world.getLayerCount(); layer++) {

            // get the blocked layout for this layer
            const blockedLayout = world.getCollisionLayout(layer);

            // test each entity
            entityStack.forEach(entity => {

                // make the collision test
                if (blockedLayout[entity.pos.y][entity.pos.x]) {

                    // collision with world detected!
                    this.messageBus.send(new CollisionWithWorldDetectedMessage(
                        // the entity that caused the collision
                        entity.entity,
                        // get the tile of the world layout stack
                        world.getLayout(layer)[entity.pos.y][entity.pos.x]
                    ));
                }
            });
        }
    }
}
