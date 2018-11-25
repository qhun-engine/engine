import { QhunGame } from "../engine/bootstrap/QhunGame";
import { Engine } from "../engine/Engine";

@QhunGame({
    exposeGameInstance: true
})
class Game {

    constructor(
        public e: Engine
    ) {

        setInterval(() => {
            console.log(this.e.getFPS());
        }, 500);
    }
}
