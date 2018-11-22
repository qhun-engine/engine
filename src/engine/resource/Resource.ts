/**
 * Represents a generic resource like an image, a sound file ...
 */
export interface Resource<T = any> {

    /**
     * get the raw resource data
     */
    getData(): T;

    /**
     * set the resource data
     * @param data the new resource data
     */
    setData(data: T): ThisType<Resource<T>>;

    /**
     * Determines if the resource is currently loaded
     */
    isLoaded(): boolean;
}
