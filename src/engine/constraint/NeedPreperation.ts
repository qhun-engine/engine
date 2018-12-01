export interface NeedPreperation {

    /**
     * prepares the given object before continueing
     */
    prepare(): Promise<any>;
}
