import { Injectable } from "@qhun-engine/base";
import { On } from "../message/decorator/On";
import { MessageType } from "../message/MessageType";
import { CollisionWithEntityDetectedMessage } from "./messages/CollisionWithEntityDetectedMessage";
import { CollisionWithWorldDetectedMessage } from "./messages/CollisionWithWorldDetectedMessage";
import { CollidableEntity } from "../entity/CollidableEntity";
import { Vector } from "../math/Vector";

/**
 * handles collision detection result
 */
@Injectable()
export class PhysicManager {

    /**
     * setup nessesary physic calculations
     */
    public setupPhysics(): void {

        // noop
    }

    /**
     * handles collided entities with entities
     * @param message the collision message
     */
    @On(MessageType.Collision, CollisionWithEntityDetectedMessage)
    private onEntityCollisionDetected(message: CollisionWithEntityDetectedMessage): void {

        console.log("collision detected for entity with entity", message.getEntities());
    }

    /**
     * handles collided entities with world
     * @param message the collision message
     */
    @On(MessageType.Collision, CollisionWithWorldDetectedMessage)
    private onWorldCollisionDetected(message: CollisionWithWorldDetectedMessage): void {

        // put the entity back to a safe place
        this.setEntityToWorldSafePosition(message.getEntity());
    }

    /**
     * places the entity at the nearest safe place without world collisions
     * @param entity the entity to rescue
     */
    private setEntityToWorldSafePosition(entity: CollidableEntity): void {

        // get the direction of the vector where the entity comes from
        const originDirectionVector = entity.getVelocity().scale(-1);
        let tempNewPosition = entity.getPosition();

        // test each direction and set the entity back
        if (originDirectionVector.isPointingDown()) {
            tempNewPosition = tempNewPosition.add(Vector.DOWN);
        } else if (originDirectionVector.isPointingUp()) {
            tempNewPosition = tempNewPosition.add(Vector.UP);
        }

        if (originDirectionVector.isPointingLeft()) {
            tempNewPosition = tempNewPosition.add(Vector.LEFT);
        } else if (originDirectionVector.isPointingRight()) {
            tempNewPosition = tempNewPosition.add(Vector.RIGHT);
        }

        // set new position and remove velocity
        entity.setPosition(tempNewPosition);
        entity.setVelocity(Vector.ZERO);
    }
}
