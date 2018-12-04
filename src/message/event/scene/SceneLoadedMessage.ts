import { Scene } from "../../../scene/Scene";
import { EventMessage } from "../EventMessage";

/**
 * indicates that the given `Scene` has been loaded
 */
export class SceneLoadedMessage extends EventMessage<Scene> { }
