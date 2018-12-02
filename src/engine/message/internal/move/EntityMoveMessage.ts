import { InternalMessage } from "../InternalMessage";
import { MovingEntity } from "../../../entity/MovingEntity";
import { Vector } from "../../../math/Vector";

declare type EntityMovePayload = {
    entity: MovingEntity,
    target: Vector
};

/**
 * indicates that the given entity is moving to another position on the map
 */
export class EntityMoveMessage extends InternalMessage<EntityMovePayload> {

    constructor(payload: EntityMovePayload) {
        super(payload);
    }
}
