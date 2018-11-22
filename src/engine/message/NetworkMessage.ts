import { Message } from "./Message";
import { Serializable } from "../constraint/Serializable";

/**
 * an additional constraint for messages that can be send over the network
 */
export interface NetworkMessage<Payload = void> extends Message<Payload>, Serializable {

}
