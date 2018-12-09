import { Singleton } from "@qhun-engine/base";
import { RenderContext } from "../RenderContext";
import { BaseRenderContext } from "../BaseRenderContext";
import { RenderableEntity } from "../../entity/RenderableEntity";
import { Vector } from "../../math/Vector";
import { ImageResource } from "../../resource/sprite/ImageResource";
import { World } from "../../world/World";
import { Particle } from "../../particle/Particle";

/**
 * the webgl render context
 */
@Singleton()
export class WebGLRenderContext extends BaseRenderContext implements RenderContext {

    constructor(
        private canvas: HTMLCanvasElement,
        private context: WebGLRenderingContext
    ) { super(); }

    /**
     * @inheritdoc
     */
    public drawEntity(entity: RenderableEntity): void {
        // @todo: implement
    }

    /**
     * @inheritdoc
     */
    public drawWorld(world: World): void {
        // @todo: implement
    }

    /**
     * @inheritdoc
     */
    public drawText(text: string, position: Vector): void {

        // @todo: implement
    }

    /**
     * @inheritdoc
     */
    public drawImageAtPosition(image: ImageResource, position: Vector, dimension?: Vector): void {

        // @todo: implement
    }

    /**
     * @inheritdoc
     */
    public drawParticles(particles: Particle[]): void {

        // @todo: implement
    }
}
