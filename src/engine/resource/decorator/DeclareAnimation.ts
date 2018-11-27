import { Injector } from "../../di/Injector";
import { ResourceLoader } from "../ResourceLoader";
import { AfterConstructionHook } from "../../util/decorators/AfterConstructionHook";
import { ResourceError } from "../../exception/ResourceError";
import { AnimationableEntity } from "../../entity/AnimationableEntity";
import { SpriteResource } from "../sprite/SpriteResource";

/**
 * declares that this `AnimationableEntity` should have the given sprite.
 * @param animationName the animation name to add
 * @param animationImageUrl the image url of the sprite
 * @param animationDataUrl the metadata url of the animation
 * @param fps the speed of the animation in fps
 */
export function DeclareAnimation(animationName: string, animationImageUrl: string, animationDataUrl: string, fps: number): ClassDecorator {

    // tslint:disable-next-line ban-types
    return <T extends Function>(target: T) => {

        // get resource loader to declare the sprite
        const loader = Injector.getInstance().instantiateClass(ResourceLoader);

        // declare the resource result
        let resourceResult: SpriteResource;

        // declare this resource!
        loader.declare(loader.loadSprite, animationImageUrl, animationDataUrl).then(resource => {

            // set the resource of the entity
            resourceResult = resource;
        });

        // overwrite class ctor
        return AfterConstructionHook((entity: AnimationableEntity) => {

            // check for resource result
            if (!resourceResult) {

                // prepare error message
                let errorMessage: string = "This entity has been constructed before the sprite resource has been available! ";
                errorMessage += `Entity was ${entity.constructor.name}. Make sure that the resource at ${animationImageUrl} and ${animationDataUrl} exists!`;

                // throw error
                throw new ResourceError(errorMessage);
            }

            // set the animation
            entity.addAnimation(animationName, resourceResult, fps);

        })(target);
    };
}
