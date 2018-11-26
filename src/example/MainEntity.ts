import { DeclareAnimation } from "../engine/resource/decorator/DeclareAnimation";
import { ActorEntity } from "../engine/entity/impl/ActorEntity";

@DeclareAnimation([{
    name: "idle",
    animation: "assets/fighter.json",
    image: "assets/fighter.png",
    fps: 45
}])
export class MainEntity extends ActorEntity {

}
