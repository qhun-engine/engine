import { ActorEntity } from "../engine/entity/impl/ActorEntity";
import { DeclareAnimation } from "../engine/resource/decorator/DeclareAnimation";
import { DeclareTexture } from "../engine/resource/decorator/DeclareTexture";
import { EaseIn } from "../engine/animation/transition/EaseIn";

@DeclareAnimation({ name: "idle", fps: 10, animate: ["assets/fighter.png", "assets/fighter.json"] , transition: EaseIn})
@DeclareTexture("assets/fighter.png")
export class MainEntity extends ActorEntity {

}
