export interface ClassConstructor<T extends object> {

    new(...args: any[]): T;
}
