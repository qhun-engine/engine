import { DeclareAnimationOptions } from "./DeclareAnimationOptions";
import { ReflectionMetadata } from "../../constraint/ReflectionMetadata";
import { AfterConstructionHook } from "../../util/decorators/AfterConstructionHook";
import { AnimationableEntity } from "../../entity/AnimationableEntity";
import { Engine } from "../../Engine";
import { ClassConstructor } from "../../constraint/ClassConstructor";
import { DeclareAnimationMetadata } from "./DeclareAnimationMetadata";
import { SpriteResource } from "../sprite/SpriteResource";
import "reflect-metadata";

/**
 * a class level decorator for entity classes that directly registers this animation for this entity
 */
export function DeclareAnimation(options: DeclareAnimationOptions[]): ClassDecorator {

    // tslint:disable-next-line ban-types
    return <T extends Function>(target: T) => {

        // declare all animations on the entities metadata
        const animations: DeclareAnimationMetadata[] = [];
        options.forEach(option => {
            animations.push({
                image: option.image,
                animation: option.animation,
                name: option.name,
                fps: option.fps
            });
        });
        Reflect.defineMetadata(ReflectionMetadata.DeclareAnimation, animations, target);

        // add this target to the storage repository
        const current = Reflect.getMetadata(ReflectionMetadata.DeclareAnimationRepository, Engine) as ClassConstructor[] || [];
        const index = current.indexOf(target as any);
        if (index === -1) {
            current.push(target as any);
            Reflect.defineMetadata(ReflectionMetadata.DeclareAnimationRepository, current, Engine);
        }

        // hook into the construction of the entity
        return AfterConstructionHook((entityClass: AnimationableEntity) => {

            // ger declared metadata with filled sprite data
            const loadedData = Reflect.getMetadata(ReflectionMetadata.DeclareAnimation, target) as DeclareAnimationMetadata[] || [];

            // add the animation
            loadedData.forEach(anim => {
                entityClass.addAnimation(anim.name, anim.sprite as SpriteResource, anim.fps);
            });
        })(target);
    };
}
