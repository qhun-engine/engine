const start = performance.now();

import { Vector } from "./math/Vector";
import { Random } from "./math/Random";
import { Inject } from "./di/Inject";
import { TransitionContainer } from "./animation/transition/TransitionContainer";
import { Injector } from "./di/Injector";
import { ResourceLoader } from "./resource/ResourceLoader";
import { TextResource } from "./resource/text/TextResource";

export class Engine {

    @Inject()
    public rl!: ResourceLoader;

    @Inject()
    public transition!: TransitionContainer;

    public vector: typeof Vector = Vector;
    public random: typeof Random = Random;
}

(window as any).engine = new Engine();
(window as any).injector = Injector.getInstance();

((window as any).engine as Engine).rl.loadResource("/qhun-engine.js", TextResource).then(r => {
    console.log(r);
}, err => {
    console.error(err);
});

const end = performance.now();

console.log(`Started in ${end - start}ms`);
