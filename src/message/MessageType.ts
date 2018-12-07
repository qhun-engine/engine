export enum MessageType {

    /**
     * Input type messages are broadcasting messages from the input module.
     * They indicate that the user has inputted some information.
     */
    Input = "Input",

    /**
     * Environment type message are broadcasting messages from the environment module.
     * They indicate that eg. viewport changes happening or an input device has been changed.
     * Also contains messages for fullscreen enable/disable
     */
    Environment = "Environment",

    /**
     * Moving messages are targeted messages. They indicate that the receiver of this message should
     * move to a given position. Targets can be `MovableEntity` objects
     */
    Moving = "Moving",

    /**
     * Animation messages are targeted messages. They indicate that a certain target should play a defined animaton
     * Targets can be `RenderableEntity` objects.
     */
    Animation = "Animation",

    /**
     * Targeted messages about an object collides with another object
     */
    Collision = "Collision",

    /**
     * Scene related broadcasting messages. Contains messages about loading/unloading, switching between scenes
     */
    Scene = "Scene",

    /**
     * Engine internal related broadcasting messages. Contains pause/unpause, engine ready message ...
     */
    Engine = "Engine",

    /**
     * Contains network related status messages as broadcasting messages.
     */
    Network = "Network",

    /**
     * Contains auto related messages. They are targeted
     */
    Audio = "Audio"
}
