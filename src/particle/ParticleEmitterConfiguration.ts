import { Vector } from "../math/Vector";

export interface ParticleEmitterConfiguration {

    /**
     * the total amount of particles that can life parallely
     * @default 100
     */
    totalParticleAmount: number;

    /**
     * the amount of particles that should be emitted per seconds
     * Can be calculated via `totalParticleAmount / duration_in_seconds`
     * @default 100/2
     */
    emissionRate: number;

    /**
     * the average speed of one particle
     * @default [10,10]
     */
    speed: Vector;

    /**
     * a randomizer value that will be added to the speed vector.
     * - example: speed = [5,5], randomness = [3,2] can produce
     * particles with a speed from [2,3] to [8,7]
     * @default [1,1]
     */
    speedRandomness: Vector;

    /**
     * the start position of particles. think of it as it is the position of the particle emitter
     * @default [0,0]
     */
    position: Vector;

    /**
     * a randomizer value for the position
     * @default [1,1]
     */
    positionRandomness: Vector;

    /**
     * the average amount of milliseconds where a particle will transition from
     * its initial state to its final state and position
     * @default 1500
     */
    life: number;

    /**
     * a randomizer value that will increase/decrease the average life time.
     * @default 500
     */
    lifeRandomness: number;

    /**
     * the average emitting angle in radian
     * @default 0
     */
    angle: number;

    /**
     * a randomizer value that will increase/decrease the average emitting angle
     * @default 20
     */
    angleRandomness: number;

    /**
     * the average radius of one particle in pixel
     * @default 10
     */
    radius: number;

    /**
     * a randomizer value that will increase/decrease the average radius of one particle in pixel
     * @default 4
     */
    radiusRandomness: number;

    /**
     * the color in format RGBA of one particle at birth time
     * @default [1,1,1,1]
     */
    startColor: [number, number, number, number];

    /**
     * a randomizer value to change the start color in each given segment.
     * a number overflow will be maxed to 255 (white) or mined to 0 (black)
     * @default [0,0,0,0]
     */
    startColorRandomness: [number, number, number, number];

    /**
     * the color in format RGBA of one particle at birth time
     * @default startColor
     */
    endColor: [number, number, number, number];

    /**
     * a randomizer value to change the end color in each given segment.
     * a number overflow will be maxed to 255 (white) or mined to 0 (black)
     * @default startColorRandomness
     */
    endColorRandomness: [number, number, number, number];

    /**
     * the amount of milliseconds where the emitter emitts particles
     * @default Infinity
     */
    duration: number;
}
