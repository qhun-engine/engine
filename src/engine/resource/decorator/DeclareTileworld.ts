import { Injector } from "../../di/Injector";
import { ResourceLoader } from "../ResourceLoader";
import { TileworldResource } from "../tileset/TileworldResource";
import { AfterConstructionHook } from "../../util/decorators/AfterConstructionHook";
import { BaseTileworld } from "../tileset/BaseTileworld";
import { ResourceError } from "../../exception/ResourceError";
import { ConstraintError } from "../../exception/ConstraintError";
import { TileworldChunkedResource } from "../tileset/TileworldChunkedResource";

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

        // declare the resource result
        let tileworldResource: TileworldResource;

        // set the final resource
        let resource = TileworldResource;
        if (chunkSize > 1) {

            // world should be chunked
            resource = TileworldChunkedResource;
        }

        // declare this resource!
        loader.declare(loader.loadTileworld, worldUrl, resource, {
            beforeProcessCallback: (worldResource: TileworldResource) => {

                // set chunksize if requested
                if (chunkSize > 1 && worldResource instanceof TileworldChunkedResource) {
                    worldResource.setChunkSize(chunkSize);
                }
            }
        }).then(resourceResult => {

            // set the resource of the entity
            tileworldResource = resourceResult;
        });

        // overwrite class ctor
        return AfterConstructionHook((world: BaseTileworld) => {

            // check for resource result
            if (!tileworldResource) {

                // prepare error message
                let errorMessage: string = "This world has been constructed before the tileworld resource has been available! ";
                errorMessage += `World was ${world.constructor.name}. Make sure that the resource at ${worldUrl} exists!`;

                // throw error
                throw new ResourceError(errorMessage);
            }

            // set the texture
            world.setTileworldResource(tileworldResource);

        })(target);
    };
}
