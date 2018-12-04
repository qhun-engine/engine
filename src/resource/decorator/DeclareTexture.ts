import { Injector } from "@qhun-engine/base";

import { ResourceLoader } from "../ResourceLoader";
import { ImageResource } from "../sprite/ImageResource";
import { AfterConstructionHook } from "../../util/decorators/AfterConstructionHook";
import { ResourceError } from "../../exception/ResourceError";
import { Renderable } from "../../constraint/Renderable";

/**
 * declares that this `Renderable` should have the given texture.
 * @param textureUrl the texture url
 */
export function DeclareTexture(textureUrl: string): ClassDecorator {

    // tslint:disable-next-line ban-types
    return <T extends Function>(target: T) => {

        // get resource loader to declare the texture
        const loader = Injector.getInstance().instantiateClass(ResourceLoader);

        // declare the resource result
        let resourceResult: ImageResource;

        // declare this resource!
        loader.declare(loader.loadImage, textureUrl).then(resource => {

            // set the resource of the entity
            resourceResult = resource;
        });

        // overwrite class ctor
        return AfterConstructionHook((entity: Renderable) => {

            // check for resource result
            if (!resourceResult) {

                // prepare error message
                let errorMessage: string = "This entity has been constructed before the texture resource has been available! ";
                errorMessage += `Entity was ${entity.constructor.name}. Make sure that the resource at ${textureUrl} exists!`;

                // throw error
                throw new ResourceError(errorMessage);
            }

            // set the texture
            entity.setTexture(resourceResult.getData());

        })(target);
    };
}
