import { DeclareAnimation, DeclareTexture, ActorEntity } from "../engine";

@DeclareAnimation({ name: "idle", fps: 30, animate: ["assets/fighter.png", "assets/fighter.json"] })
@DeclareTexture("assets/fighter1.png")
export class MainEntity extends ActorEntity {

    protected speed: number = 100;
    protected friction: number = .5;
}
