export interface Scene {

    isLoaded(): boolean;

    loadScene(): Promise<void>;

    unloadScene(): Promise<void>;
}
