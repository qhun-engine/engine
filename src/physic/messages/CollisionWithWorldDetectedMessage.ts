import { MessageType } from "../../message/MessageType";
import { CollidableEntity } from "../../entity/CollidableEntity";
import { BroadcastMessageBase } from "../../message/impl/BroadcastMessageBase";
import { Tile } from "../../world/Tile";

export class CollisionWithWorldDetectedMessage extends BroadcastMessageBase<void> {

    protected type = MessageType.Collision;

    constructor(
        protected entity: CollidableEntity,
        protected worldOrTile: Tile | "worldBounds"
    ) {
        super(undefined);
    }

    /**
     * get the entity that has collided with the world
     */
    public getEntity(): CollidableEntity {

        return this.entity;
    }

    /**
     * get the object that the entity has hit
     */
    public getCollisionObject(): Tile | "worldBounds" {

        return this.worldOrTile;
    }

}
