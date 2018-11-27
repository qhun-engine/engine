import { ActorEntity } from "../engine/entity/impl/ActorEntity";
import { DeclareAnimation } from "../engine/resource/decorator/DeclareAnimation";

@DeclareAnimation("idle", "assets/fighter.png", "assets/fighter.json", 12)
export class MainEntity extends ActorEntity {

}
