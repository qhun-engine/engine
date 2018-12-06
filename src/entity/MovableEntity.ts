import { HasSpeed } from "../constraint/HasSpeed";
import { CanMove } from "../constraint/CanMove";
import { HasVelocity } from "../constraint/HasVelocity";
import { Entity } from "./Entity";
import { HasFriction } from "../constraint/HasFriction";
import { CanHandleMessages } from "../constraint/CanHandleMessages";

/**
 * indicates that this entity can move, has speed, has friction and velocity
 */
export interface MovableEntity extends Entity, HasSpeed, CanMove, HasVelocity, HasFriction, CanHandleMessages { }
