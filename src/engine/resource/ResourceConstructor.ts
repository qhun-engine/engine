import { Resource } from "./Resource";

export interface ResourceConstructor<T extends Resource> {

    new(data: any): T;
}
