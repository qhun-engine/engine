import { QhunGame } from "../engine/bootstrap/QhunGame";
import { EngineReadyMessage } from "../engine/message/internal/state/EngineReadyMessage";
import { Once } from "../engine/message/decorator/Once";
import { MainEntity } from "./MainEntity";
import { MainScene } from "./MainScene";
import { SceneManager } from "../engine/scene/SceneManager";
import { AnimationManager } from "../engine/animation/AnimationManager";
import { TransitionContainer } from "../engine/animation/transition/TransitionContainer";
import { Entity } from "../engine/entity/Entity";
import { Vector } from "../engine/math/Vector";
import { Random } from "../engine/math/Random";
import { Renderable } from "../engine/constraint/Renderable";
import { ResourceLoader } from "../engine/resource/ResourceLoader";
import { XmlTextResource } from "../engine/resource/text/XmlTextResource";
import { TileworldChunkedResource } from "../engine/resource/tileset/TileworldChunkedResource";

@QhunGame({
    exposeGameInstance: true,
    renderer: "canvas",
    debugMode: true,
    fps: 60
})
class Game {

    constructor(
        private sceneMan: SceneManager,
        private animation: AnimationManager,
        private t: TransitionContainer,
        private resourceLoader: ResourceLoader
    ) {

        this.resourceLoader.declare(this.resourceLoader.loadTileworld, "assets/world/mainWorld.tmx", TileworldChunkedResource).then(world => {

            console.log(world);
        });
    }

    @Once(EngineReadyMessage)
    private startGame(): void {

        console.log("READY!");
    }
}
