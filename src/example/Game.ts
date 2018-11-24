import { QhunGame } from "../engine/bootstrap/QhunGame";
import { ResourceLoader } from "../engine/resource/ResourceLoader";
import { SoundManager } from "../engine/resource/sound/SoundManager";

@QhunGame({
    exposeGameInstance: true
})
class Game {

    constructor(
        public rl: ResourceLoader,
        public sound: SoundManager
    ) { }
}
