import { Injector } from "../../di/Injector";
import { ResourceLoader } from "../ResourceLoader";
import { TileworldResource } from "../tileset/TileworldResource";
import { AfterConstructionHook } from "../../util/decorators/AfterConstructionHook";
import { TileworldChunkedResource } from "../tileset/TileworldChunkedResource";
import { World } from "../../world/World";
import { Loadable } from "../Loadable";

/**
 * declares that this renderable object should get the given tileworld resource
 * @param worldUrl the url of the TMX file
 * @param chunkSize if the chunksize is greater than 1, your world will be chunked
 */
export function DeclareTileworld(worldUrl: string, chunkSize: number = 1): ClassDecorator {

    // tslint:disable-next-line ban-types
    return <T extends Function>(target: T) => {

        // check if this decorator can fit onto the target
        /*if (!(target instanceof BaseTileworld)) {

             throw new ConstraintError(`@${DeclareTileworld.name}() can only set on classes that derive from ${BaseTileworld.name}`);
         }*/

        // get resource loader to declare the texture
        const loader = Injector.getInstance().instantiateClass(ResourceLoader);

        // set the final resource
        let resource = TileworldResource;
        if (chunkSize > 1) {

            // world should be chunked
            resource = TileworldChunkedResource;
        }

        // declare this resource!
        const loadable: Loadable<TileworldResource> = loader.createLoadable(loader.loadTileworld, worldUrl, resource, {
            beforeProcessCallback: (worldResource: TileworldResource) => {

                // set chunksize if requested
                if (chunkSize > 1 && worldResource instanceof TileworldChunkedResource) {
                    worldResource.setChunkSize(chunkSize);
                }
            }
        });

        // overwrite class ctor
        return AfterConstructionHook((world: World) => {

            // set the texture
            world.setResource(loadable);

        })(target);
    };
}
