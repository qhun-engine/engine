import { Scene } from "../../../scene/Scene";
import { EventMessage } from "../EventMessage";

/**
 * indicates that the given `Scene` has been unloaded
 */
export class SceneUnloadedMessage extends EventMessage<Scene> { }
