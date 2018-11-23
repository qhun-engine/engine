export interface InjectableOptions {

    /**
     * declares this injectable class to be a singleton class
     * that is beeing cached when multiple classes request this service
     * @default true
     */
    singleton?: boolean;
}
