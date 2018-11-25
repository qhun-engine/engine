import { QhunGame } from "../engine/bootstrap/QhunGame";
import { MessageBus } from "../engine/message/MessageBus";
import { SceneManager } from "../engine/scene/SceneManager";
import { SceneSwitchedMessage } from "../engine/message/event/scene/SceneSwitchedMessage";

@QhunGame({
    exposeGameInstance: true
})
class Game {

    constructor(
        public mb: MessageBus,
        public sm: SceneManager
    ) {

        const scene: any = { testScene: true, loadScene: () => new Promise(resolve => resolve()), isLoaded: () => false };
        this.sm.switchScene(scene);

        this.mb.observe().filter(m => m instanceof SceneSwitchedMessage).subscribe(m => console.log(m));
    }
}
