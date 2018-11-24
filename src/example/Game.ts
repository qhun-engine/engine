import { QhunGame } from "../engine/bootstrap/QhunGame";
import { SoundManager } from "../engine/resource/sound/SoundManager";
import { ResourceManager } from "../engine/resource/ResourceManager";

@QhunGame({
    exposeGameInstance: true
})
class Game {

    constructor(
        public resource: ResourceManager,
        public sound: SoundManager
    ) { }
}
