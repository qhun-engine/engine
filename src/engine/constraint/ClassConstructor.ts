export interface ClassConstructor<T extends object = object> {

    new(...args: any[]): T;
}
