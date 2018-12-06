import { TargetedMessage } from "../../message/TargetedMessage";
import { MovableEntity } from "../MovableEntity";

export class EntityMovingMessage implements TargetedMessage<MovableEntity> { }