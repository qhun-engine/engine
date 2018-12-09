/**
 * identifies that this object can be destroyed
 */
export interface Destroyable {

    /**
     * destroys this object
     */
    destroy(...args: any[]): void;
}
