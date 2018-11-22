/**
 * LCG implementation for quick random number generation
 */
export class Random {

    private readonly modulo: number = 0x80000000;
    private readonly multiplier: number = 0x41c64e6d;
    private readonly increment: number = 0x3039;

    /**
     * the current state of the random number generator
     */
    private state: number;

    /**
     * @param seed the seed for your random numbers.
     */
    constructor(seed?: number) {

        // add default seed
        if (seed === undefined) {
            seed = Math.floor(Math.random() * (this.modulo - 1));
        }

        // check for valid seed
        if (!isFinite(seed)) {
            throw new Error("Given seed is not a finite number");
        }

        // set current state to seed
        this.state = seed;
    }

    /**
     * get a random number between 0 and 1 inclusive
     */
    public getFloat(): number {

        return this.getInt() / (this.modulo - 1);
    }

    /**
     * get a random non floating number
     */
    public getInt(): number {

        // override current state
        this.state = (this.multiplier * this.state + this.increment) % this.modulo;
        return this.state;
    }

    /**
     * get a random number between min and max
     * @param min the minimal value including
     * @param max the maximal value excluding
     */
    public getBetween(min: number, max: number): number {

        const rangeSize = max - min;
        const intRandom = this.getInt() / this.modulo;
        return min + Math.floor(intRandom * rangeSize);
    }

    /**
     * get a random value from the array data
     * @param arrayData the array data stack
     */
    public getFrom<T extends any[], R extends keyof T>(arrayData: T): R {

        return arrayData[this.getBetween(0, arrayData.length)];
    }

}
