import { Injectable } from "@qhun-engine/base";
import { ParticleEmitter } from "./ParticleEmitter";
import { ParticleEmitterConfiguration } from "./ParticleEmitterConfiguration";
import { RenderContext } from "../render/RenderContext";
import { Engine } from "../Engine";
import { MessageType } from "../message/MessageType";
import { EngineReadyMessage } from "../bootstrap/messages/EngineReadyMessage";
import { Once } from "../message/decorator/Once";
import { On } from "../message/decorator/On";

/**
 * a factory class that creates particle emitters with given options
 */
@Injectable({
    autoCreateInstanceOnBootstrap: true
})
export class ParticleEmitterFactory {

    /**
     * all currently active emitters
     */
    private emitterStack: ParticleEmitter[] = [];

    /**
     * creates a new particle emitter instance using the given options
     * @param options the options for the emitter
     */
    public createEmitter(options: Partial<ParticleEmitterConfiguration>): ParticleEmitter {

        // create a new emitter using the supplied options
        const emitter = new ParticleEmitter(options, instance => {

            // remove this emitter from the stack
            this.emitterStack.splice(this.emitterStack.indexOf(instance), 1);
        });

        // store this emitter internally to allow update particles
        this.emitterStack.push(emitter);

        return emitter;
    }

    /**
     * update all internal particle emitter instances
     */
    @On(MessageType.Engine, EngineReadyMessage)
    private updateParticleEmitters(message: EngineReadyMessage): void {

        message.getData().addLifeCycleHook("draw", (delta: number, timeDelta: number, renderContent: RenderContext, engine: Engine) => {

            // update all emitter instances
            this.emitterStack.filter(e => e.isActive()).forEach(emitter => {

                // update very particle
                emitter.update(delta, timeDelta, engine);

                // draw every particle
                renderContent.drawParticles(emitter.getActiveParticles());
            });

        });
    }
}
