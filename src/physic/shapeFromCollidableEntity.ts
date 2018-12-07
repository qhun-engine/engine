import { CollidableEntity } from "../entity/CollidableEntity";
import { Shape } from "./shape/Shape";
import { CollisionType } from "./collision/CollisionType";
import { RectangleShape } from "./shape/RectangleShape";
import { CircleShape } from "./shape/CircleShape";
import { PolygonShape } from "./shape/PolygonShape";

/**
 * creates a shape from a collidable entity to make collision hit tests
 * @param entity the entity to convert
 */
export function shapeFromCollidableEntity(entity: CollidableEntity): Shape {

    // get entity position
    const position = entity.getPosition();
    const size = entity.getSize();

    // get the collision type and create the shape
    switch (entity.getCollisionType()) {

        case CollisionType.Rectangle:
            return new RectangleShape(position.x, position.y, size.x, size.y);

        case CollisionType.Circle:
            return new CircleShape(position.x, position.y, size.x >= size.y ? size.x : size.y);

        case CollisionType.Polygon:
            return new PolygonShape();
    }
}
