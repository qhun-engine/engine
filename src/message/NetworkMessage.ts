import { Serializable } from "@qhun-engine/base";

import { Message } from "./Message";

/**
 * an additional constraint for messages that can be send over the network
 */
export interface NetworkMessage<Payload = void> extends Message<Payload>, Serializable {

}
