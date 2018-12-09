import { Particle } from "./Particle";
import { ParticleEmitterConfiguration } from "./ParticleEmitterConfiguration";
import { Vector } from "../math/Vector";
import { Random } from "../math/Random";
import { Destroyable } from "../constraint/Destroyable";
import { Updateable } from "../constraint/Updateable";
import { Engine } from "../Engine";

export class ParticleEmitter implements Destroyable, Updateable {

    /**
     * the current pool of particles
     */
    protected particlePool: Particle[] = [];

    /**
     * all options for this particle emitter with given or default values
     */
    protected options: ParticleEmitterConfiguration;

    /**
     * initial options at constructing tile
     */
    protected initialOptions: ParticleEmitterConfiguration;

    /**
     * the randomizer instance
     */
    protected randomizer: Random = new Random();

    /**
     * the current amount of emitted particles
     */
    protected currentParticleCount: number = 0;

    /**
     * the current elapsed time
     */
    protected elapsed: number = 0;

    /**
     * the current active state
     */
    protected active: boolean = false;

    /**
     * a number for the emitting process
     */
    protected emitterCounterDelta: number = 0;

    /**
     * an index for a particle on the pool to be processed at update time
     */
    protected currentProcessParticleIndex: number = 0;

    /**
     * @param options all options for this particle emitter
     */
    constructor(
        options: Partial<ParticleEmitterConfiguration>,
        private onDestroyCallback: (emitter: ParticleEmitter) => void
    ) {

        // merge with default options to get all required options
        // to run this emitter instance
        this.initialOptions = this.mergeDefaultValues(options);
        this.options = this.initialOptions;
    }

    /**
     * starts the emitting process
     */
    public start(): this {

        // set active flag
        this.active = true;

        // init the pool
        this.init();

        return this;
    }

    /**
     * check if this emitter is currently active
     */
    public isActive(): boolean {

        return this.active;
    }

    /**
     * reset everything (options and particles) to the init state
     */
    public reset(): this {

        // reset options
        this.options = this.initialOptions;

        // empty the current particle pool
        // the garbage collector will care about memory freeing
        this.particlePool = [];

        // init the pool
        this.init();

        // done
        return this;
    }

    /**
     * destroys this emitter instance
     */
    public destroy(): void {

        // execute the destroy callback
        this.onDestroyCallback(this);

        // delete the pool
        // garbage collector handles the rest
        this.particlePool = [];
    }

    /**
     * get all active particles
     */
    public getActiveParticles(): Particle[] {

        const active = this.particlePool.slice(0, this.currentParticleCount - 1);
        return active;
    }

    /**
     * @inheritdoc
     */
    public update(delta: number, timeDelta: number, engine: Engine): void {

        // add elapsed time
        this.elapsed += delta;

        // determin current active state
        this.active = this.elapsed < this.options.duration;

        // break if the emitter is not active anymore
        if (!this.active) { return; }

        delta /= 1000;

        // when an emissionRate is given, use the time delta to emit new particles
        if (this.options.emissionRate) {

            // get the emitting rate in milliseconds
            const rate = 1 / this.options.emissionRate;

            // add current delta to the emitting rate delta
            this.emitterCounterDelta += delta;

            // add as many particles as the time allows (rate)
            while (this.emitterCounterDelta > rate && this.emitParticle()) {

                // particle has been added, reduce the emitter delta
                this.emitterCounterDelta -= rate;
            }
        }

        // update particles
        this.currentProcessParticleIndex = 0;
        while (this.currentProcessParticleIndex < this.currentParticleCount) {

            // process this particle
            this.updateParticle(
                // get the current index from the pool
                this.particlePool[this.currentProcessParticleIndex],
                // add the delta
                delta
            );
        }
    }

    /**
     * updates the given particle
     * @param particle the particle to update
     * @param delta the current time delta
     */
    private updateParticle(particle: Particle, delta: number): void {

        // first check if the particle currently lifes
        if (particle.getLifeTime() > 0) {

            // particle lifes, let it age a bit
            const colorDelta = particle.getColorDelta();
            const newColor: [number, number, number, number] = particle.getColor().map((component, index) => {
                return component + colorDelta[index] * delta;
            }) as [number, number, number, number];

            // adjust particle properties
            particle
                // update position
                .setPosition(particle.getPosition().add(particle.getVelocity().scale(delta)))
                // update lifetime
                .setLifeTime(particle.getLifeTime() - delta * 1000)
                // update color
                .setColor(newColor);

            // next particle please (pre increment because of the while loop)
            ++this.currentProcessParticleIndex;

        } else {

            // particle has died, carry it to its grave
            // get replace the current particle position with an active particle
            this.particlePool[this.currentProcessParticleIndex] = this.particlePool[this.currentParticleCount - 1];

            // put this particle back to the end of the pool
            this.particlePool[this.options.totalParticleAmount - 1] = particle;

            // decrease active particle counter
            --this.currentParticleCount;
        }
    }

    /**
     * inits the particle pool
     */
    private init(): void {

        // create a particle for every possible particle
        for (let i = 0; i < this.options.totalParticleAmount; i++) {
            this.particlePool.push(new Particle());
        }
    }

    /**
     * check if all particles are currently active
     */
    private allParticlesAreActive(): boolean {

        return this.currentParticleCount === this.options.totalParticleAmount;
    }

    /**
     * emits a new particle
     * @returns true if the particle has been emitted, false if out of particles
     */
    private emitParticle(): boolean {

        // check if there are particles left
        if (this.allParticlesAreActive()) {
            return false;
        }

        // get a new particle from the pool and initialize it
        const particle = this.particlePool[this.currentParticleCount++];

        // initialize this particle
        this.initializeParticle(particle);

        return true;
    }

    /**
     * initializes the given particle and configures every possible property with some randomness
     * @param particle the particle to init
     */
    private initializeParticle(particle: Particle): void {

        // set all particle values
        particle
            .setPosition(this.getRandomVector(this.options.position, this.options.positionRandomness))
            .setAngle(this.getRandomNumber(this.options.angle, this.options.angleRandomness))
            .setSize(this.getRandomNumber(this.options.radius, this.options.radiusRandomness))
            .setLifeTime(this.getRandomNumber(this.options.life, this.options.lifeRandomness));

        // calculate velocity
        const velocity = Vector.from(
            Math.cos(particle.getAngle() * Math.PI / 180),
            -Math.sin(particle.getAngle() * Math.PI / 180)
        ).multiply(this.getRandomVector(this.options.speed, this.options.speedRandomness));

        // set velocity
        particle.setVelocity(velocity);

        // prepare start and end color
        const startColor = this.getRandomColor(this.options.startColor, this.options.startColorRandomness);
        const endColor = this.getRandomColor(this.options.endColor, this.options.endColorRandomness);

        // generate color delta
        const colorDelta: number[] = [];
        startColor.forEach((component, index) => {
            colorDelta[index] = (endColor[index] - component) / (particle.getLifeTime() || .01);
        });

        // set current color and color delta to be able to tween to the endColor when updateing
        particle.setColor(startColor)
            .setColorDelta(startColor);
    }

    /**
     * calculates a random vector
     * @param base the initial value of the vector
     * @param randomizer the randomizer value
     */
    private getRandomVector(base: Vector, randomizer: Vector): Vector {

        return base.add(randomizer.scale(this.randomizer.getFloatWithSign()));
    }

    /**
     * calculates a random number
     * @param base the initial value of the number
     * @param randomizer the randomizer value
     */
    private getRandomNumber(base: number, randomizer: number): number {

        return base + randomizer * this.randomizer.getFloatWithSign();
    }

    /**
     * get a random color
     * @param base the initial value of the color
     * @param randomizer the randomizer value
     */
    private getRandomColor(base: [number, number, number, number], randomizer: [number, number, number, number]): [number, number, number, number] {

        const red = base[0] + randomizer[0] * this.randomizer.getFloatWithSign();
        const green = base[1] + randomizer[1] * this.randomizer.getFloatWithSign();
        const blue = base[2] + randomizer[2] * this.randomizer.getFloatWithSign();
        let alpha = base[3] + randomizer[3] * this.randomizer.getFloatWithSign();

        // generate a color array that stays within the color bounds.
        const colorArray = [red, green, blue].map(color => {
            if (color > 255) {
                return 255;
            } else if (color < 0) {
                return 0;
            }
            return color;
        });

        // alpha bound check
        if (alpha > 1) {
            alpha = 1;
        } else if (alpha < 0) {
            alpha = 0;
        }

        // add alpha to stack
        colorArray.push(alpha);

        // return the random color array
        return colorArray as [number, number, number, number];
    }

    /**
     * merges the given options with default values
     * @param options the current options
     */
    private mergeDefaultValues(options: Partial<ParticleEmitterConfiguration>): ParticleEmitterConfiguration {

        const current = {
            angle: typeof options.angle === "number" ? options.angle : 0,
            angleRandomness: typeof options.angleRandomness === "number" ? options.angleRandomness : 20,
            duration: typeof options.duration === "number" ? options.duration : Infinity,
            emissionRate: typeof options.emissionRate === "number" ? options.emissionRate : 50,
            life: typeof options.life === "number" ? options.life : 1500,
            lifeRandomness: typeof options.lifeRandomness === "number" ? options.lifeRandomness : 500,
            radius: typeof options.radius === "number" ? options.radius : 10,
            radiusRandomness: typeof options.radiusRandomness === "number" ? options.radiusRandomness : 4,
            speed: typeof options.speed === "object" && options.speed instanceof Vector ? options.speed : Vector.from(10),
            speedRandomness: typeof options.speedRandomness === "object" && options.speedRandomness instanceof Vector ? options.speedRandomness : Vector.from(1), // tslint:disable-line
            position: typeof options.position === "object" && options.position instanceof Vector ? options.position : Vector.from(0),
            positionRandomness: typeof options.positionRandomness === "object" && options.positionRandomness instanceof Vector ? options.positionRandomness : Vector.from(1), // tslint:disable-line
            totalParticleAmount: typeof options.totalParticleAmount === "number" ? options.totalParticleAmount : 100,
            startColor: Array.isArray(options.startColor) ? options.startColor : [1, 1, 1, 1],
            startColorRandomness: Array.isArray(options.startColorRandomness) ? options.startColorRandomness : [0, 0, 0, 0]
        } as Partial<ParticleEmitterConfiguration>;

        // add end colors
        current.endColor = Array.isArray(options.endColor) ? options.endColor : current.startColor;
        current.endColorRandomness = Array.isArray(options.endColorRandomness) ? options.endColorRandomness : current.startColorRandomness;

        // everything added
        return current as ParticleEmitterConfiguration;
    }
}
