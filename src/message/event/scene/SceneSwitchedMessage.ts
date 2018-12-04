import { Scene } from "../../../scene/Scene";
import { EventMessage } from "../EventMessage";

/**
 * indicates that the `SceneManager` is switching between two scenes
 */
export class SceneSwitchedMessage extends EventMessage<{ oldScene?: Scene, newScene: Scene }> {

    constructor(newScene: Scene, oldScene?: Scene) {
        super({ newScene, oldScene });
    }
}
