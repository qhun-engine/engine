import { QhunGame } from "../engine/bootstrap/QhunGame";
import { SceneManager } from "../engine/scene/SceneManager";
import { ResourceManager } from "../engine/resource/ResourceManager";
import { Engine } from "../engine/Engine";
import { MainWorld } from "./MainWorld";
import { MainScene } from "./MainScene";

@QhunGame({
    exposeGameInstance: true,
    renderer: "canvas",
    debugMode: true,
    fps: 20
})
class Game {

    constructor(
        private sm: SceneManager,
        private rm: ResourceManager,
        private engine: Engine
    ) {

        Promise.all([
            this.rm.loadTileMap("assets/tilemap.png", "assets/tilemap.json"),
            this.rm.loadTileWorld("assets/tileworld.json")
        ]).then(resources => {

            // build world and scene
            const world = new MainWorld(resources[0], resources[1]);
            const scene = new MainScene();

            // add to scene
            scene.setTileWorld(world);

            // switch to scene
            this.sm.switchScene(scene);

            (window as any).world = world;
        });
    }
}
