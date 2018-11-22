export enum MessageType {

    /**
     * for engine internal messages
     * @internal
     */
    INTERNAL,

    /**
     * an event message that indicates that something has happend but there
     * is no need to be sure that this message has been read
     */
    EVENT,

    /**
     * a command message indicates that the something should happen in the future
     */
    COMMAND
}
