import { Optional } from "@qhun-engine/base";
import { BroadcastMessageBase } from "../../message/impl/BroadcastMessageBase";
import { Scene } from "../Scene";
import { MessageType } from "../../message/MessageType";

export class SceneSwitchMessage extends BroadcastMessageBase<Scene> {

    protected type = MessageType.Scene;

    constructor(
        newScene: Scene,
        protected oldScene: Optional<Scene>
    ) {
        super(newScene);
    }

    /**
     * alias function for `.getData()`
     */
    public getNewScene(): Scene {

        return this.getData();
    }

    /**
     * get the old scene if any
     */
    public getOldScene(): Optional<Scene> {

        return this.oldScene;
    }
}
