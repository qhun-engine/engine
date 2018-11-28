import { ActorEntity } from "../engine/entity/impl/ActorEntity";
import { DeclareAnimation } from "../engine/resource/decorator/DeclareAnimation";
import { DeclareTexture } from "../engine/resource/decorator/DeclareTexture";

@DeclareAnimation({ name: "idle", fps: 30, animate: ["assets/fighter.png", "assets/fighter.json"] })
@DeclareTexture("assets/fighter.png")
export class MainEntity extends ActorEntity {

}
