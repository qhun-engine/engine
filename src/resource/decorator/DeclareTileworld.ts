import { Injector } from "@qhun-engine/base";
import { ResourceLoader } from "../ResourceLoader";
import { TileworldResource } from "../tileset/TileworldResource";
import { AfterConstructionHook } from "../../util/decorators/AfterConstructionHook";
import { World } from "../../world/World";
import { Loadable } from "../Loadable";

/**
 * declares that this renderable object should get the given tileworld resource
 * @param worldUrl the url of the TMX file
 * @param resource an optional world resource class
 */
export function DeclareTileworld(worldUrl: string, resource: typeof TileworldResource = TileworldResource): ClassDecorator {

    // tslint:disable-next-line ban-types
    return <T extends Function>(target: T) => {

        // get resource loader to declare the texture
        const loader = Injector.getInstance().instantiateClass(ResourceLoader);

        // declare this resource!
        const loadable: Loadable<TileworldResource> = loader.createLoadable(loader.loadTileworld, worldUrl, resource);

        // overwrite class ctor
        return AfterConstructionHook((world: World) => {

            // set the texture
            world.setResource(loadable);

        })(target);
    };
}
