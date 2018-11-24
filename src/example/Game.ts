import { QhunGame } from "../engine/bootstrap/QhunGame";
import { SoundManager } from "../engine/resource/sound/SoundManager";
import { ResourceManager } from "../engine/resource/ResourceManager";
import { Engine } from "../engine/Engine";

@QhunGame({
    exposeGameInstance: true,
    renderer: "auto"
})
class Game {

    constructor(
        public resource: ResourceManager,
        public sound: SoundManager,
        public engine: Engine
    ) { }
}
