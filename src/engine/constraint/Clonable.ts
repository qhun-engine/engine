export interface Clonable<T> {

    /**
     * clones this object and get a new equivalent object
     */
    clone(): T;
}
