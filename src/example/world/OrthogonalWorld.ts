import { DeclareTileworld } from "../../engine/resource/decorator/DeclareTileworld";
import { BaseTileworld } from "../../engine/resource/tileset/BaseTileworld";

@DeclareTileworld("assets/world/mainWorld.tmx", 10)
export class OrthogonalWorld extends BaseTileworld {

}
