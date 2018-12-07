import { MessageType } from "../../message/MessageType";
import { CollidableEntity } from "../../entity/CollidableEntity";
import { BroadcastMessageBase } from "../../message/impl/BroadcastMessageBase";

export class CollisionWithEntityDetectedMessage extends BroadcastMessageBase<void> {

    protected type = MessageType.Collision;

    constructor(
        protected entity: CollidableEntity,
        protected withEntity: CollidableEntity
    ) {

        super(undefined);
    }

    /**
     * get two entities that has collided with
     */
    public getEntities(): [CollidableEntity, CollidableEntity] {

        return [this.entity, this.withEntity];
    }
}
