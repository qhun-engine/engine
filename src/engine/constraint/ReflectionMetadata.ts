export declare type ReflectionMetadataTypes = {

    Singleton: boolean,
    Injectable: string,

    SingletonInstance: object,

    Controller: string,
    RequestMapping: string
};

export declare type ReflectionMetadata = (keyof ReflectionMetadataTypes) | string;
export const ReflectionMetadata: { [P in keyof ReflectionMetadataTypes]: ReflectionMetadata | string } = {

    Singleton: "engine:marker:singleton",
    Injectable: "engine:marker:injectable",

    SingletonInstance: "engine:concrete:singletonInstance",

    Controller: "server:controller:prefix",
    RequestMapping: "server:controller:requestMapping"
};
