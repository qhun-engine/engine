/**
 * Declares that an object can be loaded at any time without arguments. All context nessesary
 * informations must be bound to the loadable context.
 */
export declare type Loadable<T> = () => Promise<T>;
