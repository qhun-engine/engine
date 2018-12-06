import { EventMessage } from "../EventMessage";
import { Vector } from "../../../math/Vector";
import { MovingEntity } from "../../../entity/MovingEntity";

declare type EntityMoveMessagePayload = {

    /**
     * the entity that is moving
     */
    entity: MovingEntity,

    /**
     * originating position of the entity
     */
    from: Vector,

    /**
     * target position of the entity
     */
    to: Vector
};

export class EntityMoveMessage extends EventMessage<EntityMoveMessagePayload> { }
