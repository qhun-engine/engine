import { HasSpeed } from "../constraint/HasSpeed";
import { CanMove } from "../constraint/CanMove";
import { HasVelocity } from "../constraint/HasVelocity";
import { Entity } from "./Entity";
import { HasFriction } from "../constraint/HasFriction";

/**
 * indicates that this entity can move, has speed, has friction and velocity
 */
export interface MovingEntity extends Entity, HasSpeed, CanMove, HasVelocity, HasFriction { }
