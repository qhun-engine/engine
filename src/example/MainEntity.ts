import { ActorEntity } from "../engine/entity/impl/ActorEntity";
import { DeclareAnimation } from "../engine/resource/decorator/DeclareAnimation";
import { DeclareTexture } from "../engine/resource/decorator/DeclareTexture";

@DeclareAnimation("idle", "assets/fighter.png", "assets/fighter.json", 12)
@DeclareTexture("assets/fighter.png")
export class MainEntity extends ActorEntity {

}
