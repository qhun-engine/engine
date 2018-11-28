import { Injector } from "../../di/Injector";
import { ResourceLoader } from "../ResourceLoader";
import { AfterConstructionHook } from "../../util/decorators/AfterConstructionHook";
import { ResourceError } from "../../exception/ResourceError";
import { SpriteResource } from "../sprite/SpriteResource";
import { Renderable } from "../../constraint/Renderable";
import { Animation, SpriteAnimation, CallbackAnimation, isSpriteAnimation } from "../../animation/Animation";
import { AnimationManager } from "../../animation/AnimationManager";

// get resource loader to declare the sprite
const loader = Injector.getInstance().instantiateClass(ResourceLoader);
const animationManager = Injector.getInstance().instantiateClass(AnimationManager);

/**
 * declares that this `Renderable` object should have the given animation.
 * @param animation the animation options
 */
export function DeclareAnimation(animation: SpriteAnimation<[string, string] | SpriteResource> | CallbackAnimation): ClassDecorator {

    // tslint:disable-next-line ban-types
    return <T extends Function>(target: T) => {

        if (isSpriteAnimation(animation)) {

            // check if the declared animation is a tuple type
            // if so, the asset must be declared in the asset loading process
            if (Array.isArray(animation.animate)) {

                // declare this resource!
                loader.declare(loader.loadSprite, animation.animate[0], animation.animate[1]).then(resource => {

                    // overwrite the existing tuple and
                    // save the sprite resource
                    animation.animate = resource;
                });
            }

        }

        // overwrite class ctor
        return AfterConstructionHook((entity: Renderable) => {

            // check for resource result
            if (isSpriteAnimation(animation) && !(animation.animate instanceof SpriteResource)) {

                // prepare error message
                const errorMessage = `This entity has been constructed before the sprite resource has been available! Entity was ${entity.constructor.name}.`;

                // throw error
                throw new ResourceError(errorMessage);
            }

            // add the animation
            animationManager.addAnimation(entity, animation as Animation);

        })(target);
    };
}
