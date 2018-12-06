import { BroadcastMessageBase } from "../../message/impl/BroadcastMessageBase";
import { Scene } from "../Scene";
import { MessageType } from "../../message/MessageType";

export class SceneLoadMessage extends BroadcastMessageBase<Scene> {

    protected type = MessageType.Scene;
}
