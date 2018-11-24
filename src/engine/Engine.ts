const start = performance.now();

import { Vector } from "./math/Vector";
import { Random } from "./math/Random";
import { Inject } from "./di/Inject";
import { TransitionContainer } from "./animation/transition/TransitionContainer";
import { Injector } from "./di/Injector";

export class Engine {

    @Inject()
    public transition!: TransitionContainer;

    public vector: typeof Vector = Vector;
    public random: typeof Random = Random;
}

(window as any).engine = new Engine();
(window as any).injector = Injector.getInstance();

const end = performance.now();

console.log(`Started in ${end - start}ms`);
